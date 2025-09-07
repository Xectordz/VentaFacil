import toast from 'react-hot-toast'
import React from 'react'

// Hook para mostrar confirmaciones elegantes
export const useConfirm = () => {
  const confirm = (message, onConfirm, options = {}) => {
    const {
      confirmText = 'Sí, eliminar',
      cancelText = 'Cancelar',
      type = 'danger'
    } = options

    toast((t) => (
      React.createElement('div', { className: 'confirm-toast' }, [
        React.createElement('div', { className: 'confirm-message', key: 'message' }, [
          React.createElement('span', { className: 'confirm-icon', key: 'icon' }, '⚠️'),
          React.createElement('p', { key: 'text' }, message)
        ]),
        React.createElement('div', { className: 'confirm-actions', key: 'actions' }, [
          React.createElement('button', {
            key: 'confirm',
            className: `confirm-btn confirm-btn--${type}`,
            onClick: () => {
              toast.dismiss(t.id)
              onConfirm()
            }
          }, confirmText),
          React.createElement('button', {
            key: 'cancel',
            className: 'confirm-btn confirm-btn--cancel',
            onClick: () => toast.dismiss(t.id)
          }, cancelText)
        ])
      ])
    ), {
      duration: Infinity,
      style: {
        background: '#ffffff',
        padding: '0',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        minWidth: '320px',
      }
    })
  }

  return { confirm }
}
