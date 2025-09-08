import { createClient } from '@supabase/supabase-js'

// Servicio de notificaciones por correo electrónico
export class EmailNotificationService {
  constructor(supabaseClient, adminEmail) {
    this.supabase = supabaseClient
    this.adminEmail = adminEmail
  }

  // Función para enviar correo usando Supabase Edge Functions o servicio externo
  async sendEmail({ to, subject, html, text }) {
    try {
      // Opción 1: Usando Supabase Edge Functions (recomendado)
      const { data, error } = await this.supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          html,
          text
        }
      })

      if (error) {
        console.error('Error sending email via Supabase:', error)
        
        // Opción 2: Fallback usando EmailJS (para desarrollo)
        return await this.sendEmailWithEmailJS({ to, subject, html, text })
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error in email service:', error)
      return { success: false, error: error.message }
    }
  }

  // Fallback usando EmailJS para desarrollo/testing
  async sendEmailWithEmailJS({ to, subject, html, text }) {
    try {
      // Necesitarás configurar EmailJS con tu cuenta
      const emailJS = window.emailjs
      
      if (!emailJS) {
        console.warn('EmailJS no está disponible')
        return { success: false, error: 'EmailJS not available' }
      }

      const templateParams = {
        to_email: to,
        subject: subject,
        message_html: html,
        message_text: text
      }

      await emailJS.send(
        'YOUR_SERVICE_ID', // Configurar en EmailJS
        'YOUR_TEMPLATE_ID', // Configurar en EmailJS
        templateParams,
        'YOUR_PUBLIC_KEY' // Configurar en EmailJS
      )

      return { success: true }
    } catch (error) {
      console.error('Error sending email with EmailJS:', error)
      return { success: false, error: error.message }
    }
  }

  // Notificar al admin sobre nuevo pedido
  async notifyAdminNewOrder(order, customerInfo) {
    const subject = `🛒 Nuevo Pedido #${order.id} - ${customerInfo.name}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6; text-align: center;">🛒 Nuevo Pedido Recibido</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Detalles del Pedido</h3>
          <p><strong>Número de Pedido:</strong> #${order.id}</p>
          <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleString('es-ES')}</p>
          <p><strong>Total:</strong> $${order.total}</p>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
          <h3>👤 Información del Cliente</h3>
          <p><strong>Nombre:</strong> ${customerInfo.name}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Teléfono:</strong> ${customerInfo.phone || 'No proporcionado'}</p>
          <p><strong>Dirección:</strong> ${customerInfo.address || 'No proporcionada'}</p>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
          <h3>🛍️ Productos Pedidos</h3>
          ${order.items.map(item => `
            <div style="border-bottom: 1px solid #f1f5f9; padding: 10px 0; display: flex; justify-content: space-between;">
              <div>
                <strong>${item.name}</strong><br>
                <small>Cantidad: ${item.quantity}</small>
              </div>
              <div style="text-align: right;">
                $${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          `).join('')}
          
          <div style="text-align: right; padding-top: 15px; border-top: 2px solid #3b82f6; margin-top: 15px;">
            <strong style="font-size: 1.2em;">Total: $${order.total}</strong>
          </div>
        </div>

        ${order.notes ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h4>📝 Notas del Cliente:</h4>
            <p>${order.notes}</p>
          </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280;">Por favor, revisa este pedido y contacta al cliente para confirmar la entrega.</p>
        </div>
      </div>
    `

    const text = `
      Nuevo Pedido #${order.id}
      
      Cliente: ${customerInfo.name}
      Email: ${customerInfo.email}
      Total: $${order.total}
      
      Productos:
      ${order.items.map(item => `- ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      ${order.notes ? `Notas: ${order.notes}` : ''}
    `

    return await this.sendEmail({
      to: this.adminEmail,
      subject,
      html,
      text
    })
  }

  // Notificar al cliente sobre confirmación de pedido
  async notifyCustomerOrderConfirmed(order, customerInfo, businessInfo) {
    const subject = `✅ Pedido Confirmado #${order.id} - ${businessInfo.name}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981; text-align: center;">✅ ¡Pedido Confirmado!</h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3>¡Hola ${customerInfo.name}!</h3>
          <p>Tu pedido ha sido confirmado y está siendo preparado. Te contactaremos pronto para coordinar la entrega.</p>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Resumen del Pedido #${order.id}</h3>
          <p><strong>Fecha del Pedido:</strong> ${new Date(order.created_at).toLocaleString('es-ES')}</p>
          <p><strong>Estado:</strong> <span style="color: #10b981; font-weight: bold;">Confirmado</span></p>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
          <h3>🛍️ Productos Pedidos</h3>
          ${order.items.map(item => `
            <div style="border-bottom: 1px solid #f1f5f9; padding: 10px 0; display: flex; justify-content: space-between;">
              <div>
                <strong>${item.name}</strong><br>
                <small>Cantidad: ${item.quantity}</small>
              </div>
              <div style="text-align: right;">
                $${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          `).join('')}
          
          <div style="text-align: right; padding-top: 15px; border-top: 2px solid #10b981; margin-top: 15px;">
            <strong style="font-size: 1.2em;">Total: $${order.total}</strong>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📞 Información de Contacto</h3>
          <p><strong>${businessInfo.name}</strong></p>
          ${businessInfo.phone ? `<p>📱 ${businessInfo.phone}</p>` : ''}
          ${businessInfo.email ? `<p>📧 ${businessInfo.email}</p>` : ''}
          ${businessInfo.address ? `<p>📍 ${businessInfo.address}</p>` : ''}
          ${businessInfo.hours ? `<p>🕒 ${businessInfo.hours}</p>` : ''}
        </div>

        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #eff6ff; border-radius: 8px;">
          <p style="color: #1e40af; margin: 0;">${businessInfo.confirmationMessage || 'Gracias por tu pedido. Te contactaremos pronto.'}</p>
        </div>
      </div>
    `

    const text = `
      ¡Pedido Confirmado #${order.id}!
      
      Hola ${customerInfo.name},
      
      Tu pedido ha sido confirmado y está siendo preparado.
      
      Productos:
      ${order.items.map(item => `- ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      Total: $${order.total}
      
      Contacto: ${businessInfo.name}
      ${businessInfo.phone ? `Teléfono: ${businessInfo.phone}` : ''}
      ${businessInfo.email ? `Email: ${businessInfo.email}` : ''}
      
      ${businessInfo.confirmationMessage || 'Gracias por tu pedido. Te contactaremos pronto.'}
    `

    return await this.sendEmail({
      to: customerInfo.email,
      subject,
      html,
      text
    })
  }

  // Notificar al cliente sobre cancelación de pedido
  async notifyCustomerOrderCancelled(order, customerInfo, businessInfo, reason = '') {
    const subject = `❌ Pedido Cancelado #${order.id} - ${businessInfo.name}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444; text-align: center;">❌ Pedido Cancelado</h2>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3>Hola ${customerInfo.name},</h3>
          <p>Lamentamos informarte que tu pedido #${order.id} ha sido cancelado.</p>
          ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Detalles del Pedido Cancelado</h3>
          <p><strong>Número de Pedido:</strong> #${order.id}</p>
          <p><strong>Fecha del Pedido:</strong> ${new Date(order.created_at).toLocaleString('es-ES')}</p>
          <p><strong>Total:</strong> $${order.total}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📞 ¿Necesitas Ayuda?</h3>
          <p>Si tienes alguna pregunta sobre esta cancelación, no dudes en contactarnos:</p>
          ${businessInfo.phone ? `<p>📱 ${businessInfo.phone}</p>` : ''}
          ${businessInfo.email ? `<p>📧 ${businessInfo.email}</p>` : ''}
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280;">Esperamos poder atenderte en una próxima oportunidad.</p>
        </div>
      </div>
    `

    const text = `
      Pedido Cancelado #${order.id}
      
      Hola ${customerInfo.name},
      
      Lamentamos informarte que tu pedido #${order.id} ha sido cancelado.
      ${reason ? `Motivo: ${reason}` : ''}
      
      Total del pedido: $${order.total}
      
      Si tienes preguntas, contáctanos:
      ${businessInfo.phone ? `Teléfono: ${businessInfo.phone}` : ''}
      ${businessInfo.email ? `Email: ${businessInfo.email}` : ''}
    `

    return await this.sendEmail({
      to: customerInfo.email,
      subject,
      html,
      text
    })
  }
}
