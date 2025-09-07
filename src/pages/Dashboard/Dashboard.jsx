import React, { useState, useEffect } from 'react'
import styles from './Dashboard.module.css'
import { ShoppingCart, Package, TrendingUp, DollarSign } from 'lucide-react'
import { useSales } from '../../hooks/useSales'
import { useProducts } from '../../hooks/useProducts'

const Dashboard = () => {
  const { getSalesStats } = useSales()
  const { products } = useProducts()
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageTicket: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      const todayStats = await getSalesStats('today')
      const monthStats = await getSalesStats('month')
      
      setStats({
        today: todayStats,
        month: monthStats
      })
      setLoading(false)
    }
    
    loadStats()
  }, [])

  const dashboardStats = [
    {
      title: 'Ventas Hoy',
      value: loading ? '...' : `$${stats.today?.totalSales?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      change: '+12%',
      positive: true
    },
    {
      title: 'Productos Vendidos',
      value: loading ? '...' : (stats.today?.totalTransactions || 0).toString(),
      icon: ShoppingCart,
      change: '+8%',
      positive: true
    },
    {
      title: 'Productos en Stock',
      value: products.length.toString(),
      icon: Package,
      change: products.filter(p => p.stock < 10).length > 0 ? 'Stock bajo' : 'OK',
      positive: products.filter(p => p.stock < 10).length === 0
    },
    {
      title: 'Ventas del Mes',
      value: loading ? '...' : `$${stats.month?.totalSales?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      change: '+24%',
      positive: true
    }
  ]

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Dashboard</h2>
      
      <div className={styles.statsGrid}>
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.iconWrapper}>
                  <Icon size={24} />
                </div>
                <span className={`${styles.change} ${stat.positive ? styles.positive : styles.negative}`}>
                  {stat.change}
                </span>
              </div>
              <div className={styles.statBody}>
                <h3 className={styles.statValue}>{stat.value}</h3>
                <p className={styles.statTitle}>{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.quickActions}>
        <h3>Acciones Rápidas</h3>
        <div className={styles.actionGrid}>
          <button className={styles.actionBtn}>
            <ShoppingCart size={20} />
            Nueva Venta
          </button>
          <button className={styles.actionBtn}>
            <Package size={20} />
            Agregar Producto
          </button>
          <button className={styles.actionBtn}>
            <TrendingUp size={20} />
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
