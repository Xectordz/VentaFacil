import { useState, useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'

export const useOnlineOrders = () => {
  const { supabase } = useSupabase()
  const [orders, setOrders] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener todos los pedidos
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('online_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders(data || [])
      
      // Contar pedidos pendientes
      const pending = (data || []).filter(order => 
        order.status === 'pending' || order.status === 'nuevo'
      ).length
      setPendingCount(pending)

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Obtener solo el conteo de pedidos pendientes (más eficiente para el sidebar)
  const fetchPendingCount = async () => {
    try {
      const { data, error, count } = await supabase
        .from('online_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'nuevo'])

      if (error) {
        // Si la tabla no existe, devolver 0
        if (error.message.includes('relation "online_orders" does not exist')) {
          setPendingCount(0)
          return { success: true, count: 0 }
        }
        throw error
      }

      setPendingCount(count || 0)
      return { success: true, count: count || 0 }
    } catch (error) {
      console.error('Error fetching pending count:', error)
      setPendingCount(0) // Valor por defecto
      return { success: false, error: error.message }
    }
  }

  // Actualizar estado de un pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('online_orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()

      if (error) throw error

      // Actualizar estado local
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ))

      // Recalcular conteo de pendientes
      if (newStatus !== 'pending' && newStatus !== 'nuevo') {
        setPendingCount(prev => Math.max(0, prev - 1))
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error.message }
    }
  }

  // Crear un nuevo pedido
  const createOrder = async (orderData) => {
    try {
      const { data, error } = await supabase
        .from('online_orders')
        .insert([{
          ...orderData,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error

      const newOrder = data[0]
      setOrders(prev => [newOrder, ...prev])
      setPendingCount(prev => prev + 1)

      return { success: true, data: newOrder }
    } catch (error) {
      console.error('Error creating order:', error)
      return { success: false, error: error.message }
    }
  }

  // Suscribirse a cambios en tiempo real
  const subscribeToOrders = () => {
    try {
      const subscription = supabase
        .channel('online_orders_channel')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'online_orders' 
          }, 
          (payload) => {
            console.log('Order change received:', payload)
            
            if (payload.eventType === 'INSERT') {
              const newOrder = payload.new
              setOrders(prev => [newOrder, ...prev])
              if (newOrder.status === 'pending' || newOrder.status === 'nuevo') {
                setPendingCount(prev => prev + 1)
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedOrder = payload.new
              setOrders(prev => prev.map(order => 
                order.id === updatedOrder.id ? updatedOrder : order
              ))
              // Recalcular conteo pendientes
              fetchPendingCount()
            } else if (payload.eventType === 'DELETE') {
              const deletedOrder = payload.old
              setOrders(prev => prev.filter(order => order.id !== deletedOrder.id))
              if (deletedOrder.status === 'pending' || deletedOrder.status === 'nuevo') {
                setPendingCount(prev => Math.max(0, prev - 1))
              }
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up real-time subscription:', error)
      return () => {} // Función vacía para evitar errores
    }
  }

  // Inicializar datos al cargar
  useEffect(() => {
    fetchPendingCount()
    
    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToOrders()
    
    return unsubscribe
  }, [])

  return {
    orders,
    pendingCount,
    loading,
    error,
    fetchOrders,
    fetchPendingCount,
    updateOrderStatus,
    createOrder,
    subscribeToOrders
  }
}
