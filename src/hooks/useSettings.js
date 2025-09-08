import { useState, useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'

export const useSettings = () => {
  const { supabase } = useSupabase()
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener todas las configuraciones
  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')

      if (error) throw error

      // Convertir array a objeto para fácil acceso
      const settingsObject = {}
      data.forEach(setting => {
        settingsObject[setting.key] = setting.value
      })

      setSettings(settingsObject)
      return { success: true, data: settingsObject }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Actualizar una configuración específica
  const updateSetting = async (key, value) => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert({ 
          key, 
          value: String(value),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })
        .select()

      if (error) throw error

      // Actualizar estado local
      setSettings(prev => ({
        ...prev,
        [key]: String(value)
      }))

      return { success: true, data }
    } catch (error) {
      console.error('Error updating setting:', error)
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  // Obtener una configuración específica
  const getSetting = (key, defaultValue = '') => {
    return settings[key] || defaultValue
  }

  // Obtener configuraciones relacionadas con el tema
  const getThemeSettings = () => {
    return {
      mode: getSetting('theme_mode', 'light'),
      primaryColor: getSetting('theme_primary_color', '#3b82f6'),
      secondaryColor: getSetting('theme_secondary_color', '#64748b')
    }
  }

  // Obtener configuraciones de contacto
  const getContactSettings = () => {
    return {
      email: getSetting('admin_email', ''),
      phone: getSetting('admin_phone', ''),
      address: getSetting('business_address', ''),
      hours: getSetting('business_hours', '')
    }
  }

  // Obtener configuraciones de negocio
  const getBusinessSettings = () => {
    return {
      name: getSetting('business_name', 'Mi Negocio'),
      currency: getSetting('currency_symbol', '$'),
      taxRate: parseFloat(getSetting('tax_rate', '0')),
      confirmationMessage: getSetting('order_confirmation_message', 'Gracias por tu pedido. Te contactaremos pronto.')
    }
  }

  // Obtener configuraciones de notificaciones
  const getNotificationSettings = () => {
    return {
      emailEnabled: getSetting('email_notifications', 'true') === 'true',
      onlineOrdersEnabled: getSetting('enable_online_orders', 'true') === 'true'
    }
  }

  // Aplicar tema actual al documento
  const applyTheme = () => {
    const theme = getThemeSettings()
    const root = document.documentElement

    // Aplicar variables CSS customizadas
    root.style.setProperty('--primary-color', theme.primaryColor)
    root.style.setProperty('--secondary-color', theme.secondaryColor)

    // Aplicar modo de tema
    if (theme.mode === 'dark') {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    } else if (theme.mode === 'light') {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    } else { // auto
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark-theme')
        root.classList.remove('light-theme')
      } else {
        root.classList.add('light-theme')
        root.classList.remove('dark-theme')
      }
    }
  }

  // Refrescar configuraciones
  const refreshSettings = async () => {
    return await fetchSettings()
  }

  // Inicializar configuraciones al cargar
  useEffect(() => {
    fetchSettings()
  }, [])

  // Aplicar tema cuando cambian las configuraciones
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      applyTheme()
    }
  }, [settings])

  // Escuchar cambios del sistema para modo auto
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (getSetting('theme_mode', 'light') === 'auto') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [settings])

  return {
    settings,
    loading,
    error,
    updateSetting,
    getSetting,
    getThemeSettings,
    getContactSettings,
    getBusinessSettings,
    getNotificationSettings,
    applyTheme,
    refreshSettings
  }
}
