// hooks/useSales.js
import { useState, useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'

export const useSales = () => {
  const { supabase } = useSupabase()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar ventas
  const fetchSales = async (filters = {}) => {
    try {
      setLoading(true)
      let query = supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros de fecha si existen
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate)
      }

      const { data, error } = await query

      if (error) throw error
      setSales(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error cargando ventas:', err)
    } finally {
      setLoading(false)
    }
  }

  // Procesar venta
  const processSale = async (saleData) => {
    try {
      // Iniciar transacción: insertar venta principal
      const { data: saleResult, error: saleError } = await supabase
        .from('sales')
        .insert([{
          total: saleData.total,
          items: saleData.items
        }])
        .select()

      if (saleError) throw saleError

      const saleId = saleResult[0].id

      // Insertar items de la venta para mejores reportes
      const saleItems = saleData.items.map(item => ({
        sale_id: saleId,
        product_code: item.code,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)

      if (itemsError) throw itemsError

      // Actualizar stock de productos
      for (const item of saleData.items) {
        const { error: stockError } = await supabase.rpc('update_product_stock', {
          product_code: item.code,
          quantity_sold: item.quantity
        })
        
        if (stockError) {
          console.warn(`Error actualizando stock para ${item.code}:`, stockError)
        }
      }

      // Actualizar lista local
      setSales([saleResult[0], ...sales])
      
      return { success: true, data: saleResult[0] }
    } catch (err) {
      console.error('Error procesando venta:', err)
      return { success: false, error: err.message }
    }
  }

  // Obtener estadísticas
  const getSalesStats = async (period = 'today') => {
    try {
      let startDate, endDate
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      switch (period) {
        case 'today':
          startDate = today.toISOString()
          endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
          break
        case 'week':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
          endDate = new Date().toISOString()
          break
        case 'month':
          startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
          endDate = new Date().toISOString()
          break
        default:
          startDate = today.toISOString()
          endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      }

      const { data, error } = await supabase
        .from('sales')
        .select('total, created_at')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (error) throw error

      const totalSales = data.reduce((sum, sale) => sum + parseFloat(sale.total), 0)
      const totalTransactions = data.length

      return {
        totalSales,
        totalTransactions,
        averageTicket: totalTransactions > 0 ? totalSales / totalTransactions : 0
      }
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err)
      return { totalSales: 0, totalTransactions: 0, averageTicket: 0 }
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  return {
    sales,
    loading,
    error,
    processSale,
    getSalesStats,
    refetch: fetchSales
  }
}
