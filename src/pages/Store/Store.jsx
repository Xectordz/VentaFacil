import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { useSettings } from '../../hooks/useSettings';
import toast from 'react-hot-toast';
import styles from './Store.module.css';

export default function Store() {
  const { products, loading, error } = useProducts();
  const { addToCart, getItemQuantity, updateQuantity, isInCart } = useCart();
  const { getContactSettings, getBusinessSettings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const contactInfo = getContactSettings();
  const businessInfo = getBusinessSettings();

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
    } else {
      toast.error('Producto sin stock disponible');
    }
  };

  const handleQuantityChange = (product, change) => {
    const currentQuantity = getItemQuantity(product.id);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      updateQuantity(product.id, 0);
    } else if (newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    } else {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error al cargar productos: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nuestra Tienda</h1>
        <p className={styles.subtitle}>Encuentra los mejores productos al mejor precio</p>
        
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => {
          const quantity = getItemQuantity(product.id);
          const inCart = isInCart(product.id);
          
          return (
            <div key={product.id} className={styles.productCard}>
              {/* Imagen del producto */}
              <div className={styles.productImageContainer}>
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className={styles.productImage}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={styles.productImagePlaceholder}
                  style={{ display: product.image_url ? 'none' : 'flex' }}
                >
                  <span className={styles.placeholderIcon}>📦</span>
                  <span className={styles.placeholderText}>{product.name}</span>
                </div>
              </div>

              <div className={styles.productHeader}>
                <h3 className={styles.productName}>{product.name}</h3>
                <span className={styles.productCategory}>{product.category}</span>
              </div>

              <div className={styles.productInfo}>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>${product.price.toFixed(2)}</span>
                  <span className={styles.stock}>
                    Stock: {product.stock}
                  </span>
                </div>

                <div className={styles.productActions}>
                  {!inCart ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`${styles.addButton} ${product.stock === 0 ? styles.disabled : ''}`}
                    >
                      <ShoppingCart size={16} />
                      {product.stock === 0 ? 'Sin Stock' : 'Agregar'}
                    </button>
                  ) : (
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => handleQuantityChange(product, -1)}
                        className={styles.quantityButton}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.quantity}>{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product, 1)}
                        disabled={quantity >= product.stock}
                        className={`${styles.quantityButton} ${quantity >= product.stock ? styles.disabled : ''}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {inCart && (
                <div className={styles.inCartBadge}>
                  <ShoppingCart size={12} />
                  En el carrito
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && searchTerm && (
        <div className={styles.noResults}>
          <p>No se encontraron productos que coincidan con "{searchTerm}"</p>
        </div>
      )}

      {/* Sección de contacto */}
      <div className={styles.contactSection}>
        <div className={styles.contactHeader}>
          <h2>📞 Información de Contacto</h2>
          <p>¿Tienes preguntas o necesitas ayuda? ¡Contáctanos!</p>
        </div>
        
        <div className={styles.contactGrid}>
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className={styles.contactCard}>
              <Mail size={24} />
              <div>
                <h3>Correo Electrónico</h3>
                <p>{contactInfo.email}</p>
              </div>
            </a>
          )}
          
          {contactInfo.phone && (
            <a href={`tel:${contactInfo.phone}`} className={styles.contactCard}>
              <Phone size={24} />
              <div>
                <h3>Teléfono</h3>
                <p>{contactInfo.phone}</p>
              </div>
            </a>
          )}
          
          {contactInfo.address && (
            <div className={styles.contactCard}>
              <MapPin size={24} />
              <div>
                <h3>Dirección</h3>
                <p>{contactInfo.address}</p>
              </div>
            </div>
          )}
          
          {contactInfo.hours && (
            <div className={styles.contactCard}>
              <Clock size={24} />
              <div>
                <h3>Horarios</h3>
                <p>{contactInfo.hours}</p>
              </div>
            </div>
          )}
        </div>
        
        {businessInfo.confirmationMessage && (
          <div className={styles.orderInfo}>
            <h3>📋 Información de Pedidos</h3>
            <p>{businessInfo.confirmationMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
