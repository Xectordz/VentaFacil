import React, { useState, useRef } from 'react';
import useImageUpload from '../../hooks/useImageUpload';
import styles from './ImageUploader.module.css';

const ImageUploader = React.forwardRef(({ product, onImageUpdate }, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(product?.image_url || null);
  const [pendingImageFile, setPendingImageFile] = useState(null); // Imagen pendiente de guardar
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadProductImage, deleteProductImage, uploading, uploadProgress } = useImageUpload();

  // Debug temporal - ver qué producto recibimos
  React.useEffect(() => {
    console.log('ImageUploader received product:', product);
  }, [product]);

  // Función para comprimir imagen sin subirla
  const compressImageToWebP = (file, quality = 0.8, maxWidth = 800, maxHeight = 600) => {
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

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('El archivo debe ser una imagen');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setCompressing(true);

      // Comprimir imagen inmediatamente
      const compressedFile = await compressImageToWebP(file);
      
      // Crear URL para preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreview(previewUrl);
      
      // Guardar archivo comprimido para subir después
      setPendingImageFile(compressedFile);
      
      // Notificar al componente padre que hay una imagen pendiente
      onImageUpdate?.({ 
        isPending: true, 
        file: compressedFile,
        previewUrl: previewUrl 
      });

    } catch (error) {
      alert(`Error al procesar la imagen: ${error.message}`);
    } finally {
      setCompressing(false);
    }
  };

  // Función para subir imagen pendiente (llamada desde el formulario)
  const uploadPendingImage = async (productId) => {
    if (!pendingImageFile || !productId) return null;

    try {
      const result = await uploadProductImage(pendingImageFile, productId);
      if (result.success) {
        setPendingImageFile(null); // Limpiar imagen pendiente
        setPreview(result.imageUrl); // Actualizar con URL real
        return result;
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Exponer función para uso externo usando useImperativeHandle
  React.useImperativeHandle(ref, () => ({
    uploadPendingImage: async (productId) => {
      if (!pendingImageFile || !productId) return null;

      try {
        const result = await uploadProductImage(pendingImageFile, productId);
        if (result.success) {
          setPendingImageFile(null); // Limpiar imagen pendiente
          setPreview(result.imageUrl); // Actualizar con URL real
          return result;
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    hasPendingImage: () => !!pendingImageFile
  }), [pendingImageFile, uploadProductImage]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleDeleteImage = async () => {
    if (!product?.id || product.id === 'temp' || typeof product.id !== 'number' || !product?.image_name) return;
    
    const result = await deleteProductImage(product.id, product.image_name);
    if (result.success) {
      setPreview(null);
      onImageUpdate?.(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const isProductNew = !product?.id || product.id === 'temp' || typeof product.id !== 'number';

  return (
    <div className={styles.imageUploader}>
      {isProductNew && (
        <div className={styles.warningMessage}>
          ⚠️ Guarda el producto primero para poder subir una imagen
        </div>
      )}
      <div className={`${styles.imageContainer} ${isProductNew ? styles.disabled : ''}`}>
        {preview ? (
          <div className={styles.imagePreview}>
            <img 
              src={preview} 
              alt={product?.name || 'Product'} 
              className={styles.productImage}
            />
            {pendingImageFile && (
              <div className={styles.pendingBadge}>
                📤 Pendiente de guardar
              </div>
            )}
            <div className={styles.imageOverlay}>
              <button
                type="button"
                onClick={openFileDialog}
                className={styles.changeButton}
                disabled={uploading || compressing}
              >
                📷 Cambiar
              </button>
              <button
                type="button"
                onClick={handleDeleteImage}
                className={styles.deleteButton}
                disabled={uploading || compressing}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''} ${isProductNew ? styles.disabled : ''}`}
            onDragEnter={isProductNew ? undefined : handleDrag}
            onDragLeave={isProductNew ? undefined : handleDrag}
            onDragOver={isProductNew ? undefined : handleDrag}
            onDrop={isProductNew ? undefined : handleDrop}
            onClick={isProductNew ? undefined : openFileDialog}
          >
            <div className={styles.dropContent}>
              <div className={styles.uploadIcon}>📷</div>
              <p className={styles.dropText}>
                {isProductNew ? 
                  'Guarda el producto primero' : 
                  <>Arrastra una imagen aquí o <span>selecciona archivo</span></>
                }
              </p>
              <p className={styles.dropSubtext}>
                {isProductNew ? 
                  'Las imágenes se pueden agregar después de guardar' :
                  'PNG, JPG, WebP hasta 5MB'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {(uploading || compressing) && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: compressing ? '50%' : `${uploadProgress}%` }}
            ></div>
          </div>
          <span className={styles.progressText}>
            {compressing ? 'Comprimiendo...' : `${uploadProgress}%`}
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />
    </div>
  );
});

export default ImageUploader;
