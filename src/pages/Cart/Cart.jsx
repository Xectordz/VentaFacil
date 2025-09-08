import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getItemCount } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <ShoppingBag className={styles.emptyIcon} />
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestros productos y agrega algunos al carrito</p>
        <Link to="/tienda" className={styles.shopButton}>
          <ShoppingCart size={20} />
          Ir a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <ShoppingCart className={styles.titleIcon} />
          Mi Carrito
        </h1>
        <div className={styles.headerActions}>
          <span className={styles.itemCount}>
            {getItemCount()} {getItemCount() === 1 ? 'producto' : 'productos'}
          </span>
          <button onClick={clearCart} className={styles.clearButton}>
            <Trash2 size={16} />
            Vaciar carrito
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.cartItems}>
          {cart.items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemCategory}>{item.category}</p>
                <div className={styles.itemPrice}>
                  {formatPrice(item.price)} c/u
                </div>
              </div>

              <div className={styles.itemControls}>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className={styles.quantityButton}
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className={styles.quantityButton}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryContent}>
            <h2 className={styles.summaryTitle}>Resumen del pedido</h2>
            
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Productos ({getItemCount()})</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <hr className={styles.summaryDivider} />
              
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            <div className={styles.checkoutActions}>
              <Link to="/checkout" className={styles.checkoutButton}>
                Proceder al pago
                <ArrowRight size={20} />
              </Link>
              
              <Link to="/tienda" className={styles.continueShoppingButton}>
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
