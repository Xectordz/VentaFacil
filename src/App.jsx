import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import ClientLayout from './components/ClientLayout/ClientLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Sales from './pages/Sales/Sales'
import Inventory from './pages/Inventory/Inventory'
import Reports from './pages/Reports/Reports'
import QRGenerator from './pages/QRGenerator/QRGenerator'
import OnlineOrders from './pages/OnlineOrders/OnlineOrders'
import Settings from './pages/Settings/Settings'
import Store from './pages/Store/Store'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation'
import { SupabaseProvider } from './context/SupabaseContext'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <SupabaseProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rutas públicas de la tienda */}
            <Route path="/" element={<Navigate to="/tienda" replace />} />
            <Route path="/tienda" element={<ClientLayout />}>
              <Route index element={<Store />} />
            </Route>
            <Route path="/carrito" element={<ClientLayout />}>
              <Route index element={<Cart />} />
            </Route>
            <Route path="/checkout" element={<ClientLayout />}>
              <Route index element={<Checkout />} />
            </Route>
            <Route path="/pedido-confirmado" element={<ClientLayout />}>
              <Route index element={<OrderConfirmation />} />
            </Route>

            {/* Rutas del administrador */}
            <Route path="/admin" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sales" element={<Sales />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="qr-generator" element={<QRGenerator />} />
              <Route path="online-orders" element={<OnlineOrders />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Router>
      </CartProvider>
    </SupabaseProvider>
  )
}

export default App
