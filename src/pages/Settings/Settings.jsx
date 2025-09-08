import React, { useState, useEffect } from 'react'
import styles from './Settings.module.css'
import { Settings as SettingsIcon, Save, Mail, Phone, Palette, Bell, Store, Clock, MapPin, DollarSign } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import toast from 'react-hot-toast'

const Settings = () => {
  const { settings, loading, updateSetting, refreshSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('contact')

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleInputChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Guardar solo los cambios
      const promises = Object.keys(localSettings).map(async (key) => {
        if (localSettings[key] !== settings[key]) {
          await updateSetting(key, localSettings[key])
        }
      })
      
      await Promise.all(promises)
      await refreshSettings()
      
      toast.success('✅ Configuración guardada exitosamente')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('❌ Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'contact', label: 'Contacto', icon: Mail },
    { id: 'business', label: 'Negocio', icon: Store },
    { id: 'theme', label: 'Tema', icon: Palette },
    { id: 'notifications', label: 'Notificaciones', icon: Bell }
  ]

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <SettingsIcon size={32} />
          <div>
            <h1>Configuración</h1>
            <p>Personaliza tu aplicación de punto de venta</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={styles.saveButton}
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'contact' && (
            <div className={styles.section}>
              <h2><Mail size={24} /> Información de Contacto</h2>
              <p className={styles.sectionDescription}>
                Esta información aparecerá en la tienda online para que los clientes puedan contactarte
              </p>
              
              <div className={styles.formGroup}>
                <label htmlFor="admin_email">
                  <Mail size={18} />
                  Correo Electrónico del Administrador
                </label>
                <input
                  id="admin_email"
                  type="email"
                  value={localSettings.admin_email || ''}
                  onChange={(e) => handleInputChange('admin_email', e.target.value)}
                  placeholder="admin@minegocio.com"
                />
                <small>Este correo recibirá notificaciones de nuevos pedidos</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="admin_phone">
                  <Phone size={18} />
                  Número de Teléfono
                </label>
                <input
                  id="admin_phone"
                  type="tel"
                  value={localSettings.admin_phone || ''}
                  onChange={(e) => handleInputChange('admin_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <small>Número de contacto que verán los clientes</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="business_address">
                  <MapPin size={18} />
                  Dirección del Negocio
                </label>
                <textarea
                  id="business_address"
                  value={localSettings.business_address || ''}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  placeholder="Calle Principal 123, Ciudad, País"
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className={styles.section}>
              <h2><Store size={24} /> Información del Negocio</h2>
              <p className={styles.sectionDescription}>
                Configura los detalles de tu negocio
              </p>
              
              <div className={styles.formGroup}>
                <label htmlFor="business_name">
                  <Store size={18} />
                  Nombre del Negocio
                </label>
                <input
                  id="business_name"
                  type="text"
                  value={localSettings.business_name || ''}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder="Mi Negocio"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="business_hours">
                  <Clock size={18} />
                  Horario de Atención
                </label>
                <input
                  id="business_hours"
                  type="text"
                  value={localSettings.business_hours || ''}
                  onChange={(e) => handleInputChange('business_hours', e.target.value)}
                  placeholder="Lun - Vie: 9:00 AM - 6:00 PM"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="currency_symbol">
                  <DollarSign size={18} />
                  Símbolo de Moneda
                </label>
                <input
                  id="currency_symbol"
                  type="text"
                  value={localSettings.currency_symbol || ''}
                  onChange={(e) => handleInputChange('currency_symbol', e.target.value)}
                  placeholder="$"
                  maxLength={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tax_rate">
                  Tasa de Impuesto (%)
                </label>
                <input
                  id="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={localSettings.tax_rate || ''}
                  onChange={(e) => handleInputChange('tax_rate', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="order_confirmation_message">
                  Mensaje de Confirmación de Pedidos
                </label>
                <textarea
                  id="order_confirmation_message"
                  value={localSettings.order_confirmation_message || ''}
                  onChange={(e) => handleInputChange('order_confirmation_message', e.target.value)}
                  placeholder="Gracias por tu pedido. Te contactaremos pronto."
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className={styles.section}>
              <h2><Palette size={24} /> Personalización del Tema</h2>
              <p className={styles.sectionDescription}>
                Personaliza los colores y apariencia de tu aplicación
              </p>
              
              <div className={styles.formGroup}>
                <label htmlFor="theme_mode">
                  Modo del Tema
                </label>
                <select
                  id="theme_mode"
                  value={localSettings.theme_mode || 'light'}
                  onChange={(e) => handleInputChange('theme_mode', e.target.value)}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático (según sistema)</option>
                </select>
              </div>

              <div className={styles.colorSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="theme_primary_color">
                    Color Primario
                  </label>
                  <div className={styles.colorInput}>
                    <input
                      id="theme_primary_color"
                      type="color"
                      value={localSettings.theme_primary_color || '#3b82f6'}
                      onChange={(e) => handleInputChange('theme_primary_color', e.target.value)}
                    />
                    <input
                      type="text"
                      value={localSettings.theme_primary_color || '#3b82f6'}
                      onChange={(e) => handleInputChange('theme_primary_color', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="theme_secondary_color">
                    Color Secundario
                  </label>
                  <div className={styles.colorInput}>
                    <input
                      id="theme_secondary_color"
                      type="color"
                      value={localSettings.theme_secondary_color || '#64748b'}
                      onChange={(e) => handleInputChange('theme_secondary_color', e.target.value)}
                    />
                    <input
                      type="text"
                      value={localSettings.theme_secondary_color || '#64748b'}
                      onChange={(e) => handleInputChange('theme_secondary_color', e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.preview}>
                <h3>Vista Previa</h3>
                <div className={styles.themePreview}>
                  <div 
                    className={styles.previewCard}
                    style={{
                      '--primary-color': localSettings.theme_primary_color || '#3b82f6',
                      '--secondary-color': localSettings.theme_secondary_color || '#64748b'
                    }}
                  >
                    <div className={styles.previewHeader}>Header</div>
                    <div className={styles.previewButton}>Botón Primario</div>
                    <div className={styles.previewText}>Texto Secundario</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.section}>
              <h2><Bell size={24} /> Notificaciones</h2>
              <p className={styles.sectionDescription}>
                Configura las notificaciones por correo electrónico
              </p>
              
              <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    checked={localSettings.email_notifications === 'true'}
                    onChange={(e) => handleInputChange('email_notifications', e.target.checked ? 'true' : 'false')}
                  />
                  <span className={styles.switch}></span>
                  Habilitar Notificaciones por Correo
                </label>
                <small>Recibir correos cuando lleguen nuevos pedidos</small>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    checked={localSettings.enable_online_orders === 'true'}
                    onChange={(e) => handleInputChange('enable_online_orders', e.target.checked ? 'true' : 'false')}
                  />
                  <span className={styles.switch}></span>
                  Habilitar Pedidos Online
                </label>
                <small>Permitir que los clientes hagan pedidos desde la tienda online</small>
              </div>

              {localSettings.email_notifications === 'true' && (
                <div className={styles.notificationInfo}>
                  <h3>📧 Tipos de Notificaciones</h3>
                  <ul>
                    <li><strong>Nuevo Pedido:</strong> Se envía al correo del admin cuando un cliente hace un pedido</li>
                    <li><strong>Pedido Confirmado:</strong> Se envía al cliente cuando el admin acepta su pedido</li>
                    <li><strong>Pedido Cancelado:</strong> Se envía al cliente si se cancela un pedido</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
