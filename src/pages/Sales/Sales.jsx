import React, { useState, useRef, useEffect } from 'react'
import styles from './Sales.module.css'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { ShoppingCart, Scan, Plus, Minus, Trash2, X } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useSales } from '../../hooks/useSales'
import toast from 'react-hot-toast'

const Sales = () => {
  const { findProductByCode } = useProducts()
  const { processSale: saveSale } = useSales()
  const [cart, setCart] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [productCode, setProductCode] = useState('')
  const [processing, setProcessing] = useState(false)
  const scannerRef = useRef(null)

  const addToCart = async (code) => {
    const product = await findProductByCode(code)
    if (!product) {
      toast.error('❌ Producto no encontrado')
      return
    }

    if (product.stock <= 0) {
      toast.error('⚠️ Producto sin stock')
      return
    }

    const existingItem = cart.find(item => item.code === code)
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('⚠️ No hay suficiente stock disponible')
        return
      }
      setCart(cart.map(item => 
        item.code === code 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
      toast.success(`➕ ${product.name} agregado al carrito`)
    } else {
      setCart([...cart, { 
        code, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }])
      toast.success(`🛒 ${product.name} agregado al carrito`)
    }
    setProductCode('')
  }

  const updateQuantity = (code, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(code)
      return
    }
    setCart(cart.map(item => 
      item.code === code 
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const removeFromCart = (code) => {
    setCart(cart.filter(item => item.code !== code))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleScan = (decodedText, decodedResult) => {
    addToCart(decodedText)
    stopScanning()
  }

  const startScanning = () => {
    setIsScanning(true)
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(error => {
        console.error("Error stopping scanner:", error)
      })
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  useEffect(() => {
    if (isScanning) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        config,
        false
      )

      scanner.render(
        handleScan,
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
  }, [isScanning])

  const processSale = async () => {
    if (cart.length === 0) {
      toast.error('🛒 El carrito está vacío')
      return
    }
    
    setProcessing(true)
    const saleData = {
      total: getTotalAmount(),
      items: cart
    }
    
    // Usar toast.promise para mostrar el progreso
    toast.promise(
      saveSale(saleData),
      {
        loading: '💳 Procesando venta...',
        success: (result) => {
          setCart([])
          setProcessing(false)
          return `🎉 ¡Venta procesada por $${getTotalAmount().toFixed(2)}!`
        },
        error: (err) => {
          setProcessing(false)
          return `❌ Error: ${err.error || 'No se pudo procesar la venta'}`
        }
      }
    )
  }

  return (
    <div className={styles.sales}>
      <div className={styles.salesContainer}>
        {/* Panel de entrada de productos */}
        <div className={styles.inputPanel}>
          <h2>Nueva Venta</h2>
          
          <div className={styles.inputSection}>
            <div className={styles.manualInput}>
              <input
                type="text"
                placeholder="Código del producto"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToCart(productCode)}
                className={styles.input}
              />
              <button 
                onClick={() => addToCart(productCode)}
                className={styles.addBtn}
              >
                <Plus size={20} />
                Agregar
              </button>
            </div>

            <div className={styles.scanSection}>
              <button onClick={startScanning} className={styles.scanBtn} disabled={isScanning}>
                <Scan size={20} />
                Escanear Código
              </button>
            </div>
          </div>
        </div>

        {/* Modal del escáner */}
        {isScanning && (
          <div className={styles.scannerModal}>
            <div className={styles.scannerContent}>
              <div className={styles.scannerHeader}>
                <h3>Escanear Código de Producto</h3>
                <button onClick={stopScanning} className={styles.closeBtn}>
                  <X size={24} />
                </button>
              </div>
              <div id="qr-reader" className={styles.scannerContainer}></div>
              <p className={styles.scannerInstructions}>
                Apunta la cámara hacia el código de barras o QR del producto
              </p>
            </div>
          </div>
        )}

        {/* Carrito de compras */}
        <div className={styles.cartPanel}>
          <div className={styles.cartHeader}>
            <h3>
              <ShoppingCart size={20} />
              Carrito ({cart.length})
            </h3>
          </div>

          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <p className={styles.emptyCart}>El carrito está vacío</p>
            ) : (
              cart.map((item) => (
                <div key={item.code} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <div className={styles.itemControls}>
                    <button 
                      onClick={() => updateQuantity(item.code, item.quantity - 1)}
                      className={styles.quantityBtn}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.code, item.quantity + 1)}
                      className={styles.quantityBtn}
                    >
                      <Plus size={16} />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.code)}
                      className={styles.removeBtn}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className={styles.cartFooter}>
              <div className={styles.total}>
                <strong>Total: ${getTotalAmount().toFixed(2)}</strong>
              </div>
              <button onClick={processSale} className={styles.checkoutBtn} disabled={processing}>
                {processing ? 'Procesando...' : 'Procesar Venta'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sales
