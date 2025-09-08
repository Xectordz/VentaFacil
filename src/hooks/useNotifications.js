import { useSupabase } from '../context/SupabaseContext'
import { useSettings } from './useSettings'
import { EmailNotificationService } from '../services/emailService'

export const useNotifications = () => {
  const { supabase } = useSupabase()
  const { getContactSettings, getBusinessSettings, getNotificationSettings } = useSettings()

  // Crear instancia del servicio de correo
  const createEmailService = () => {
    const contactInfo = getContactSettings()
    return new EmailNotificationService(supabase, contactInfo.email)
  }

  // Notificar nuevo pedido al admin
  const notifyNewOrder = async (order, customerInfo) => {
    try {
      const notificationSettings = getNotificationSettings()
      
      if (!notificationSettings.emailEnabled) {
        console.log('Email notifications are disabled')
        return { success: true, message: 'Notifications disabled' }
      }

      const contactInfo = getContactSettings()
      if (!contactInfo.email) {
        console.error('Admin email not configured')
        return { success: false, error: 'Admin email not configured' }
      }

      const emailService = createEmailService()
      const result = await emailService.notifyAdminNewOrder(order, customerInfo)
      
      return result
    } catch (error) {
      console.error('Error sending new order notification:', error)
      return { success: false, error: error.message }
    }
  }

  // Notificar confirmación de pedido al cliente
  const notifyOrderConfirmed = async (order, customerInfo) => {
    try {
      const notificationSettings = getNotificationSettings()
      
      if (!notificationSettings.emailEnabled) {
        console.log('Email notifications are disabled')
        return { success: true, message: 'Notifications disabled' }
      }

      if (!customerInfo.email) {
        console.error('Customer email not provided')
        return { success: false, error: 'Customer email not provided' }
      }

      const businessInfo = {
        ...getBusinessSettings(),
        ...getContactSettings()
      }

      const emailService = createEmailService()
      const result = await emailService.notifyCustomerOrderConfirmed(order, customerInfo, businessInfo)
      
      return result
    } catch (error) {
      console.error('Error sending order confirmation notification:', error)
      return { success: false, error: error.message }
    }
  }

  // Notificar cancelación de pedido al cliente
  const notifyOrderCancelled = async (order, customerInfo, reason = '') => {
    try {
      const notificationSettings = getNotificationSettings()
      
      if (!notificationSettings.emailEnabled) {
        console.log('Email notifications are disabled')
        return { success: true, message: 'Notifications disabled' }
      }

      if (!customerInfo.email) {
        console.error('Customer email not provided')
        return { success: false, error: 'Customer email not provided' }
      }

      const businessInfo = {
        ...getBusinessSettings(),
        ...getContactSettings()
      }

      const emailService = createEmailService()
      const result = await emailService.notifyCustomerOrderCancelled(order, customerInfo, businessInfo, reason)
      
      return result
    } catch (error) {
      console.error('Error sending order cancellation notification:', error)
      return { success: false, error: error.message }
    }
  }

  // Test de notificaciones
  const testNotification = async (type = 'new_order') => {
    try {
      const mockOrder = {
        id: 'TEST-' + Date.now(),
        created_at: new Date().toISOString(),
        total: 99.99,
        items: [
          {
            name: 'Producto de Prueba',
            quantity: 2,
            price: 49.99
          }
        ],
        notes: 'Esta es una notificación de prueba'
      }

      const mockCustomer = {
        name: 'Cliente de Prueba',
        email: 'test@example.com',
        phone: '+1234567890',
        address: 'Dirección de Prueba 123'
      }

      switch (type) {
        case 'new_order':
          return await notifyNewOrder(mockOrder, mockCustomer)
        
        case 'order_confirmed':
          return await notifyOrderConfirmed(mockOrder, mockCustomer)
        
        case 'order_cancelled':
          return await notifyOrderCancelled(mockOrder, mockCustomer, 'Producto sin stock')
        
        default:
          return { success: false, error: 'Invalid test type' }
      }
    } catch (error) {
      console.error('Error testing notification:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    notifyNewOrder,
    notifyOrderConfirmed,
    notifyOrderCancelled,
    testNotification
  }
}
