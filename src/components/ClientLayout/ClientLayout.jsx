import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Store, Home } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import styles from './ClientLayout.module.css';

export default function ClientLayout() {
  const location = useLocation();
  const { getItemCount } = useCart();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Store className={styles.logoIcon} />
            <h1 className={styles.logoText}>VentaFacil</h1>
            <span className={styles.storeBadge}>Tienda</span>
          </div>
        </div>
      </header>

      <nav className={styles.navigation}>
        <Link 
          to="/tienda" 
          className={`${styles.navLink} ${isActive('/tienda') ? styles.active : ''}`}
        >
          <Home size={20} />
          <span>Productos</span>
        </Link>
        <Link 
          to="/carrito" 
          className={`${styles.navLink} ${isActive('/carrito') ? styles.active : ''}`}
        >
          <div className={styles.cartIconContainer}>
            <ShoppingCart size={20} />
            {getItemCount() > 0 && (
              <span className={styles.cartBadge}>{getItemCount()}</span>
            )}
          </div>
          <span>Carrito</span>
        </Link>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>© 2025 VentaFacil - Tienda Online</p>
        <Link to="/admin" className={styles.adminLink}>
          Acceso Administrador
        </Link>
      </footer>
    </div>
  );
}
