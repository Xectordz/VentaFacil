// 🔄 BACKUP: Usar almacenamiento local para desarrollo
import { useState } from 'react';

const useImageUploadLocal = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Función para comprimir imagen a WebP (misma que antes)
  const compressToWebP = (file, quality = 0.8, maxWidth = 800, maxHeight = 600) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/webp', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadProductImage = async (file, productId) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validar archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen debe ser menor a 5MB');
      }

      setUploadProgress(25);

      // Comprimir imagen
      const compressedFile = await compressToWebP(file);
      setUploadProgress(50);

      // Convertir a Base64 para almacenar en localStorage
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      
      return new Promise((resolve) => {
        reader.onload = () => {
          setUploadProgress(75);
          
          // Guardar en localStorage
          const imageData = reader.result;
          const imageKey = `product_image_${productId}`;
          localStorage.setItem(imageKey, imageData);
          
          setUploadProgress(100);
          
          resolve({
            success: true,
            imageUrl: imageData, // Base64 URL
            fileName: `product_${productId}_local.webp`
          });
        };
      });

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

  const deleteProductImage = async (productId) => {
    try {
      const imageKey = `product_image_${productId}`;
      localStorage.removeItem(imageKey);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para obtener imagen desde localStorage
  const getProductImage = (productId) => {
    const imageKey = `product_image_${productId}`;
    return localStorage.getItem(imageKey);
  };

  return {
    uploadProductImage,
    deleteProductImage,
    getProductImage,
    uploading,
    uploadProgress
  };
};

export default useImageUploadLocal;
