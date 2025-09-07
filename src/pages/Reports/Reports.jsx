import React, { useState, useEffect } from 'react'
import styles from './Reports.module.css'
import { BarChart3, Calendar, DollarSign, TrendingUp, Download } from 'lucide-react'
import { useSupabase } from '../../context/SupabaseContext'
import toast from 'react-hot-toast'

const Reports = () => {
  const { supabase } = useSupabase()
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  // Cargar ventas desde Supabase
  useEffect(() => {
    fetchSalesData()
  }, [selectedPeriod, dateRange])

  const fetchSalesData = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('sales')
        .select(`
          id,
          total,
          items,
          created_at
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros de fecha según el período seleccionado
      const { startDate, endDate } = getDateRange()
      if (startDate) query = query.gte('created_at', startDate)
      if (endDate) query = query.lte('created_at', endDate)

      const { data, error } = await query

      if (error) throw error

      // Formatear los datos para que coincidan con la estructura esperada
      const formattedData = data.map(sale => ({
        id: sale.id,
        date: sale.created_at.split('T')[0],
        time: new Date(sale.created_at).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        items: sale.items,
        total: parseFloat(sale.total)
      }))

      setSalesData(formattedData)
    } catch (error) {
      console.error('Error cargando ventas:', error)
      toast.error('❌ Error cargando los datos de ventas')
    }
    setLoading(false)
  }

  const getDateRange = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (selectedPeriod) {
      case 'today':
        return {
          startDate: today.toISOString(),
          endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        }
      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        return {
          startDate: yesterday.toISOString(),
          endDate: today.toISOString()
        }
      case 'week':
        return {
          startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        }
      case 'month':
        return {
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        }
      case 'custom':
        return {
          startDate: dateRange.start ? new Date(dateRange.start).toISOString() : null,
          endDate: dateRange.end ? new Date(dateRange.end + 'T23:59:59').toISOString() : null
        }
      default:
        return { startDate: null, endDate: null }
    }
  }

  const getFilteredSales = () => {
    return salesData // Los datos ya vienen filtrados desde la base de datos
  }

  const filteredSales = getFilteredSales()

  const calculateStats = () => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    const totalTransactions = filteredSales.length
    const averageTicket = totalTransactions > 0 ? totalSales / totalTransactions : 0
    
    // Productos más vendidos
    const productSales = {}
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (productSales[item.name]) {
          productSales[item.name].quantity += item.quantity
          productSales[item.name].revenue += item.price * item.quantity
        } else {
          productSales[item.name] = {
            quantity: item.quantity,
            revenue: item.price * item.quantity
          }
        }
      })
    })

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 5)

    return {
      totalSales,
      totalTransactions,
      averageTicket,
      topProducts
    }
  }

  const stats = calculateStats()

  const exportToCSV = () => {
    if (filteredSales.length === 0) {
      toast.error('📄 No hay datos para exportar')
      return
    }

    try {
      const headers = ['Fecha', 'Hora', 'Productos', 'Total']
      const csvData = [
        headers.join(','),
        ...filteredSales.map(sale => [
          sale.date,
          sale.time,
          sale.items.map(item => `${item.name} (${item.quantity})`).join('; '),
          sale.total.toFixed(2)
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-ventas-${selectedPeriod}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('📊 Reporte exportado exitosamente')
    } catch (error) {
      toast.error('❌ Error al exportar el reporte')
    }
  }

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h2>
          <BarChart3 size={24} />
          Reportes de Ventas
        </h2>
        <button onClick={exportToCSV} className={styles.exportBtn}>
          <Download size={20} />
          Exportar CSV
        </button>
      </div>

      {/* Filtros de período */}
      <div className={styles.filtersSection}>
        <h3>Período de Análisis</h3>
        <div className={styles.periodButtons}>
          {[
            { key: 'today', label: 'Hoy' },
            { key: 'yesterday', label: 'Ayer' },
            { key: 'week', label: 'Última Semana' },
            { key: 'month', label: 'Último Mes' },
            { key: 'custom', label: 'Personalizado' }
          ].map(period => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`${styles.periodBtn} ${selectedPeriod === period.key ? styles.active : ''}`}
              disabled={loading}
            >
              {period.label}
            </button>
          ))}
        </div>

        {selectedPeriod === 'custom' && (
          <div className={styles.dateRange}>
            <div className={styles.dateInput}>
              <label>Fecha inicio:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.dateInput}>
              <label>Fecha fin:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className={styles.input}
              />
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas principales */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <h4>Ventas Totales</h4>
            <p>${stats.totalSales.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BarChart3 size={24} />
          </div>
          <div className={styles.statInfo}>
            <h4>Transacciones</h4>
            <p>{stats.totalTransactions}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <h4>Ticket Promedio</h4>
            <p>${stats.averageTicket.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className={styles.topProducts}>
        <h3>Productos Más Vendidos</h3>
        <div className={styles.productsList}>
          {stats.topProducts.length === 0 ? (
            <p className={styles.noData}>No hay datos para mostrar</p>
          ) : (
            stats.topProducts.map(([productName, data], index) => (
              <div key={productName} className={styles.productItem}>
                <div className={styles.productRank}>#{index + 1}</div>
                <div className={styles.productInfo}>
                  <h4>{productName}</h4>
                  <p>{data.quantity} unidades vendidas</p>
                </div>
                <div className={styles.productRevenue}>
                  ${data.revenue.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lista de ventas */}
      <div className={styles.salesList}>
        <h3>Detalle de Ventas ({filteredSales.length})</h3>
        <div className={styles.salesTable}>
          {loading ? (
            <div className={styles.loading}>
              <Calendar size={48} color="#d1d5db" />
              <p>Cargando ventas...</p>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className={styles.noSales}>
              <Calendar size={48} color="#d1d5db" />
              <p>No hay ventas en el período seleccionado</p>
            </div>
          ) : (
            filteredSales.map(sale => (
              <div key={sale.id} className={styles.saleItem}>
                <div className={styles.saleHeader}>
                  <span className={styles.saleDate}>{sale.date} - {sale.time}</span>
                  <span className={styles.saleTotal}>${sale.total.toFixed(2)}</span>
                </div>
                <div className={styles.saleItems}>
                  {sale.items.map((item, index) => (
                    <span key={index} className={styles.saleItemDetail}>
                      {item.name} x{item.quantity} (${(item.price * item.quantity).toFixed(2)})
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
