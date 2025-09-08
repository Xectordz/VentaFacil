import React, { useState, useEffect, useRef } from 'react'
import styles from './Inventory.module.css'
import { Plus, Search, Edit, Trash2, Package, Camera, X } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { Html5QrcodeScanner } from 'html5-qrcode'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import ProductImageCell from '../../components/ProductImageCell/ProductImageCell'
import toast from 'react-hot-toast'

const Inventory = () => {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts()
  
  const { confirm } = useConfirm()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showFormScanner, setShowFormScanner] = useState(false)
  const scannerRef = useRef(null)
  const formScannerRef = useRef(null)
  const imageUploaderRef = useRef(null) // Ref para el ImageUploader
  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    price: '',
    stock: '',
    description: ''
  })

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.includes(searchTerm)
  )

  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.code || !newProduct.name) {
      toast.error('Código y nombre son requeridos')
      return
    }

    setSubmitting(true)
    const productData = {
      code: newProduct.code,
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      description: newProduct.description
    }

    const result = await addProduct(productData)
    
    if (result.success) {
      // Si hay una imagen pendiente, subirla al producto creado
      if (imageUploaderRef.current && result.data) {
        try {
          await imageUploaderRef.current.uploadPendingImage(result.data.id)
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Producto creado pero error al subir imagen')
        }
      }
      
      setNewProduct({ code: '', name: '', price: '', stock: '', description: '' })
      setShowAddForm(false)
      toast.success('✅ Producto agregado exitosamente')
    } else {
      toast.error(`❌ Error: ${result.error}`)
    }
    setSubmitting(false)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product.id)
    setNewProduct({
      code: product.code,
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description
    })
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    
    setSubmitting(true)
    const productData = {
      code: newProduct.code,
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      description: newProduct.description
    }

    const result = await updateProduct(editingProduct, productData)
    
    if (result.success) {
      // Si hay una imagen pendiente, subirla al producto actualizado
      if (imageUploaderRef.current) {
        try {
          await imageUploaderRef.current.uploadPendingImage(editingProduct)
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Producto actualizado pero error al subir imagen')
        }
      }
      
      setEditingProduct(null)
      setNewProduct({ code: '', name: '', price: '', stock: '', description: '' })
      toast.success('✅ Producto actualizado exitosamente')
    } else {
      toast.error(`❌ Error: ${result.error}`)
    }
    setSubmitting(false)
  }

  const handleDeleteProduct = async (id, productName) => {
    confirm(
      `¿Estás seguro de que quieres eliminar "${productName}"?`,
      async () => {
        const result = await deleteProduct(id)
        if (result.success) {
          toast.success('🗑️ Producto eliminado exitosamente')
        } else {
          toast.error(`❌ Error: ${result.error}`)
        }
      },
      {
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    )
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setNewProduct({ code: '', name: '', price: '', stock: '', description: '' })
    setShowAddForm(false)
  }

  const startScanner = () => {
    setShowScanner(true)
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(error => {
        console.error("Error stopping scanner:", error)
      })
      scannerRef.current = null
    }
    setShowScanner(false)
  }

  // Funciones para el escáner del formulario
  const startFormScanner = () => {
    setShowFormScanner(true)
  }

  const stopFormScanner = () => {
    if (formScannerRef.current) {
      formScannerRef.current.clear().catch(error => {
        console.error("Error stopping form scanner:", error)
      })
      formScannerRef.current = null
    }
    setShowFormScanner(false)
  }

  useEffect(() => {
    if (showScanner) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }

      const scanner = new Html5QrcodeScanner(
        "reader",
        config,
        false
      )

      scanner.render(
        (decodedText, decodedResult) => {
          // Código escaneado exitosamente
          toast.success(`Código escaneado: ${decodedText}`)
          setSearchTerm(decodedText)
          stopScanner()
        },
        (error) => {
          // Error de escaneo (esto es normal y continuo)
          console.log(`Code scan error = ${error}`)
        }
      )

      scannerRef.current = scanner
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Error cleaning up scanner:", error)
        })
      }
    }
  }, [showScanner])

  // useEffect para el escáner del formulario
  useEffect(() => {
    if (showFormScanner) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }

      const scanner = new Html5QrcodeScanner(
        "form-reader",
        config,
        false
      )

      scanner.render(
        (decodedText, decodedResult) => {
          // Código escaneado exitosamente para el formulario
          toast.success(`Código escaneado: ${decodedText}`)
          setNewProduct(prev => ({ ...prev, code: decodedText }))
          stopFormScanner()
        },
        (error) => {
          // Error de escaneo (esto es normal y continuo)
          console.log(`Form scan error = ${error}`)
        }
      )

      formScannerRef.current = scanner
    }

    return () => {
      if (formScannerRef.current) {
        formScannerRef.current.clear().catch(error => {
          console.error("Error cleaning up form scanner:", error)
        })
      }
    }
  }, [showFormScanner])

  return (
    <div className={styles.inventory}>
      <div className={styles.header}>
        <h2>
          <Package size={24} />
          Inventario
        </h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className={styles.addBtn}
          disabled={showAddForm || editingProduct}
        >
          <Plus size={20} />
          Agregar Producto
        </button>
      </div>

      {/* Buscador */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <div className={styles.searchInputWrapper}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            onClick={startScanner}
            className={styles.scanBtn}
            disabled={showScanner}
            title="Escanear código de barras/QR"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>

      {/* Modal del escáner */}
      {showScanner && (
        <div className={styles.scannerModal}>
          <div className={styles.scannerContent}>
            <div className={styles.scannerHeader}>
              <h3>Escanear Código</h3>
              <button onClick={stopScanner} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            <div id="reader" className={styles.scannerContainer}></div>
            <p className={styles.scannerInstructions}>
              Apunta la cámara hacia el código de barras o QR
            </p>
          </div>
        </div>
      )}

      {/* Modal del escáner del formulario */}
      {showFormScanner && (
        <div className={styles.scannerModal}>
          <div className={styles.scannerContent}>
            <div className={styles.scannerHeader}>
              <h3>Escanear Código del Producto</h3>
              <button onClick={stopFormScanner} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            <div id="form-reader" className={styles.scannerContainer}></div>
            <p className={styles.scannerInstructions}>
              Apunta la cámara hacia el código de barras o QR del producto
            </p>
          </div>
        </div>
      )}

      {/* Formulario de agregar/editar */}
      {(showAddForm || editingProduct) && (
        <div className={styles.formSection}>
          <h3>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Código *</label>
                <div className={styles.codeInputGroup}>
                  <input
                    type="text"
                    value={newProduct.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    className={styles.input}
                    required
                  />
                  <button 
                    type="button"
                    onClick={startFormScanner}
                    className={styles.codeScanBtn}
                    disabled={showFormScanner}
                    title="Escanear código de barras/QR"
                  >
                    <Camera size={18} />
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Nombre *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            
            {/* Sección de imagen del producto */}
            <div className={styles.formGroup}>
              <label>Imagen del Producto</label>
              <ImageUploader 
                ref={imageUploaderRef}
                product={editingProduct ? products.find(p => p.id === editingProduct) : { id: 'temp', name: newProduct.name }}
                onImageUpdate={(imageUrl) => {
                  // En el caso de edición, la imagen se actualiza automáticamente
                  // En el caso de nuevo producto, se manejará después de crear el producto
                  if (editingProduct) {
                    // Refrescar datos del producto
                    toast.success('Imagen actualizada correctamente');
                  }
                }}
              />
              <p className={styles.imageHint}>
                📎 La imagen se optimizará automáticamente a formato WebP para mejorar la velocidad de carga
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={styles.textarea}
                rows="3"
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn} disabled={submitting}>
                {submitting ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Guardar')}
              </button>
              <button type="button" onClick={cancelEdit} className={styles.cancelBtn} disabled={submitting}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de productos */}
      <div className={styles.productList}>
        {loading ? (
          <div className={styles.loading}>
            <Package size={48} color="#d1d5db" />
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        ) : (
          <>
            <div className={styles.listHeader}>
              <span>Imagen</span>
              <span>Código</span>
              <span>Nombre</span>
              <span>Precio</span>
              <span>Stock</span>
              <span>Acciones</span>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <Package size={48} color="#d1d5db" />
                <p>No hay productos en el inventario</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className={styles.productItem}>
                  <div className={styles.productImageColumn}>
                    <ProductImageCell product={product} />
                  </div>
                  <span className={styles.code}>{product.code}</span>
                  <div className={styles.productInfo}>
                    <h4>{product.name}</h4>
                    {product.description && <p>{product.description}</p>}
                  </div>
                  <span className={styles.price}>${product.price.toFixed(2)}</span>
                  <span className={`${styles.stock} ${product.stock < 10 ? styles.lowStock : ''}`}>
                    {product.stock}
                  </span>
                  <div className={styles.actions}>
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className={styles.editBtn}
                      disabled={showAddForm || editingProduct || submitting}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className={styles.deleteBtn}
                      disabled={showAddForm || editingProduct || submitting}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Inventory
