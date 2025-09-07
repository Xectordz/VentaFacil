import React, { useState } from 'react'
import styles from './QRGenerator.module.css'
import QRCode from 'qrcode'
import jsPDF from 'jspdf'
import { QrCode, Download, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

const QRGenerator = () => {
  const [productData, setProductData] = useState({
    code: '',
    name: '',
    price: '',
    description: ''
  })
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateQR = async () => {
    if (!productData.code) {
      toast.error('❌ El código del producto es requerido')
      return
    }

    setIsGenerating(true)
    try {
      // Crear los datos del QR con la información del producto
      const qrData = JSON.stringify({
        code: productData.code,
        name: productData.name,
        price: parseFloat(productData.price) || 0,
        description: productData.description
      })

      // Generar el código QR
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setQrDataUrl(dataUrl)
      toast.success('✅ Código QR generado exitosamente')
    } catch (error) {
      console.error('Error generando QR:', error)
      toast.error('❌ Error al generar el código QR')
    }
    setIsGenerating(false)
  }

  const downloadQR = () => {
    if (!qrDataUrl) return

    try {
      const link = document.createElement('a')
      link.download = `qr-${productData.code}.png`
      link.href = qrDataUrl
      link.click()
      toast.success('📥 Imagen descargada exitosamente')
    } catch (error) {
      toast.error('❌ Error al descargar la imagen')
    }
  }

  const generatePDF = () => {
    if (!qrDataUrl) return

    try {
      const pdf = new jsPDF()
      
      // Título
      pdf.setFontSize(20)
      pdf.text('Etiqueta de Producto', 20, 30)
      
      // Información del producto
      pdf.setFontSize(12)
      pdf.text(`Código: ${productData.code}`, 20, 50)
      pdf.text(`Nombre: ${productData.name}`, 20, 65)
      pdf.text(`Precio: $${productData.price}`, 20, 80)
      if (productData.description) {
        pdf.text(`Descripción: ${productData.description}`, 20, 95)
      }
      
      // Agregar el código QR
      pdf.addImage(qrDataUrl, 'PNG', 20, 110, 50, 50)
      
      // Descargar el PDF
      pdf.save(`etiqueta-${productData.code}.pdf`)
      toast.success('📄 PDF generado exitosamente')
    } catch (error) {
      toast.error('❌ Error al generar el PDF')
    }
  }

  const clearForm = () => {
    setProductData({
      code: '',
      name: '',
      price: '',
      description: ''
    })
    setQrDataUrl('')
  }

  return (
    <div className={styles.qrGenerator}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <QrCode size={24} />
          Generador de Códigos QR
        </h2>

        <div className={styles.content}>
          {/* Formulario */}
          <div className={styles.formSection}>
            <h3>Información del Producto</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="code">Código del Producto *</label>
              <input
                id="code"
                type="text"
                value={productData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Ej: 123456789"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre del Producto</label>
              <input
                id="name"
                type="text"
                value={productData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Coca Cola 500ml"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price">Precio</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={productData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={productData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción opcional del producto"
                className={styles.textarea}
                rows="3"
              />
            </div>

            <div className={styles.formActions}>
              <button 
                onClick={generateQR}
                disabled={isGenerating || !productData.code}
                className={styles.generateBtn}
              >
                {isGenerating ? 'Generando...' : 'Generar QR'}
              </button>
              <button 
                onClick={clearForm}
                className={styles.clearBtn}
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Previsualización y acciones */}
          <div className={styles.previewSection}>
            <h3>Previsualización</h3>
            
            {qrDataUrl ? (
              <div className={styles.qrPreview}>
                <div className={styles.qrContainer}>
                  <img src={qrDataUrl} alt="Código QR generado" />
                </div>
                
                <div className={styles.productInfo}>
                  <h4>{productData.name || 'Producto sin nombre'}</h4>
                  <p>Código: {productData.code}</p>
                  {productData.price && <p>Precio: ${productData.price}</p>}
                  {productData.description && <p>{productData.description}</p>}
                </div>

                <div className={styles.actions}>
                  <button onClick={downloadQR} className={styles.actionBtn}>
                    <Download size={20} />
                    Descargar PNG
                  </button>
                  <button onClick={generatePDF} className={styles.actionBtn}>
                    <Printer size={20} />
                    Generar PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.placeholder}>
                <QrCode size={64} color="#d1d5db" />
                <p>Completa el formulario y genera un código QR</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRGenerator
