import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../context/SupabaseContext';
import toast from 'react-hot-toast';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'address'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    
    if (emptyFields.length > 0) {
      toast.error('Por favor completa todos los campos obligatorios');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return false;
    }

    // Validar teléfono (básico)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Por favor ingresa un teléfono válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (cart.items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      // 1. Crear el pedido online
      const { data: order, error: orderError } = await supabase
        .from('online_orders')
        .insert([
          {
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            customer_address: formData.address,
            notes: formData.notes,
            total: cart.total,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Crear los items del pedido
      const orderItems = cart.items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Limpiar carrito y redirigir
      clearCart();
      toast.success('¡Pedido enviado correctamente!');
      
      // Redirigir a página de confirmación
      navigate('/pedido-confirmado', { 
        state: { 
          orderId: order.id,
          customerEmail: formData.email 
        } 
      });

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <CheckCircle className={styles.emptyIcon} />
        <h2>No hay productos en tu carrito</h2>
        <p>Agrega algunos productos antes de proceder al checkout</p>
        <button onClick={() => navigate('/tienda')} className={styles.shopButton}>
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Finalizar Pedido</h1>
        <p className={styles.subtitle}>Completa tus datos para realizar el pedido</p>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <User className={styles.sectionIcon} />
              Información Personal
            </h2>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Correo electrónico *
                </label>
                <div className={styles.inputWithIcon}>
                  <Mail className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Teléfono *
                </label>
                <div className={styles.inputWithIcon}>
                  <Phone className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="+52 xxx xxx xxxx"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Dirección *
                </label>
                <div className={styles.inputWithIcon}>
                  <MapPin className={styles.inputIcon} />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Dirección completa para entrega"
                    required
                  />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>
                  Notas adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Instrucciones especiales, referencias, etc."
                  rows="3"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            <CreditCard size={20} />
            {loading ? 'Procesando...' : `Confirmar Pedido ${formatPrice(cart.total)}`}
          </button>
        </form>

        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>
          
          <div className={styles.summaryItems}>
            {cart.items.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                  <p>{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <div className={styles.itemTotal}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryFooter}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalAmount}>{formatPrice(cart.total)}</span>
            </div>
          </div>

          <div className={styles.orderInfo}>
            <h3>Información del Pedido</h3>
            <ul>
              <li>📦 Procesamiento: 1-2 días hábiles</li>
              <li>🚚 Entrega: 3-5 días hábiles</li>
              <li>📧 Recibirás confirmación por email</li>
              <li>📞 Te contactaremos para coordinar entrega</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
