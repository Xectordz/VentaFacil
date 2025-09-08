import React from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'
import { 
  Home, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  QrCode,
  Globe,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useOnlineOrders } from '../../hooks/useOnlineOrders'

const Layout = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { pendingCount } = useOnlineOrders()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Ventas', href: '/admin/sales', icon: ShoppingCart },
    { name: 'Inventario', href: '/admin/inventory', icon: Package },
    { name: 'Pedidos Online', href: '/admin/online-orders', icon: Globe, badge: pendingCount },
    { name: 'Reportes', href: '/admin/reports', icon: BarChart3 },
    { name: 'Generar QR', href: '/admin/qr-generator', icon: QrCode },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
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
                  {item.badge && item.badge > 0 && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
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
                {item.badge && item.badge > 0 && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
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
          <h1 className={styles.title}>VentaFacil - Administrador</h1>
          <Link to="/tienda" className={styles.storeLink}>
            <Globe size={20} />
            Ver Tienda
          </Link>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
