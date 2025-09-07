import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'
import { 
  Home, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  QrCode,
  Menu,
  X
} from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Ventas', href: '/sales', icon: ShoppingCart },
    { name: 'Inventario', href: '/inventory', icon: Package },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Generar QR', href: '/qr-generator', icon: QrCode },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className={styles.layout}>
      {/* Sidebar para móvil */}
      <div className={`${styles.mobileSidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h2>VentaFacil</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className={styles.closeBtn}
            >
              <X size={24} />
            </button>
          </div>
          <nav className={styles.nav}>
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Sidebar para desktop */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>VentaFacil</h2>
        </div>
        <nav className={styles.nav}>
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button 
            onClick={() => setSidebarOpen(true)}
            className={styles.menuBtn}
          >
            <Menu size={24} />
          </button>
          <h1 className={styles.title}>Sistema de Punto de Venta</h1>
        </header>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
