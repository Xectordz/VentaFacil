import { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { supabase } = useSupabase();

  // Función para comprimir imagen a WebP
  const compressToWebP = (file, quality = 0.8, maxWidth = 800, maxHeight = 600) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a WebP con calidad específica
        canvas.toBlob(resolve, 'image/webp', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadProductImage = async (file, productId) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen debe ser menor a 5MB');
      }

      setUploadProgress(25);

      // Comprimir imagen a WebP
      const compressedFile = await compressToWebP(file);
      setUploadProgress(50);

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const fileName = `product_${productId}_${timestamp}.webp`;
      const filePath = `products/${fileName}`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile, {
          cacheControl: '31536000', // Cache por 1 año
          upsert: false
        });

      if (uploadError) throw uploadError;
      setUploadProgress(75);

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setUploadProgress(90);

      // Actualizar producto con la URL de la imagen
      const { error: updateError } = await supabase
        .from('products')
        .update({
          image_url: publicUrlData.publicUrl,
          image_name: fileName
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      setUploadProgress(100);
      
      return {
        success: true,
        imageUrl: publicUrlData.publicUrl,
        fileName: fileName
      };

    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteProductImage = async (productId, fileName) => {
    try {
      // Eliminar archivo de storage
      if (fileName) {
        await supabase.storage
          .from('product-images')
          .remove([`products/${fileName}`]);
      }

      // Limpiar referencias en la base de datos
      const { error } = await supabase
        .from('products')
        .update({
          image_url: null,
          image_name: null
        })
        .eq('id', productId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    uploadProductImage,
    deleteProductImage,
    uploading,
    uploadProgress
  };
};

export default useImageUpload;
