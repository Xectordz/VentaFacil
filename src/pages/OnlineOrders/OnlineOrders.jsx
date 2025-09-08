import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Eye, Mail, Phone, MapPin, Package, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '../../context/SupabaseContext';
import toast from 'react-hot-toast';
import styles from './OnlineOrders.module.css';

export default function OnlineOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('online_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            code
          )
        `)
        .eq('order_id', orderId);
      
      if (error) throw error;
      setOrderItems(data || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
      toast.error('Error al cargar items del pedido');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const handleApproveOrder = async (orderId) => {
    try {
      // Call the database function to convert order to sale
      const { data, error } = await supabase.rpc('convert_order_to_sale', {
        order_id_param: orderId
      });

      if (error) throw error;

      toast.success('Pedido aprobado y convertido a venta');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error approving order:', error);
      toast.error('Error al aprobar pedido: ' + error.message);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('online_orders')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Pedido rechazado');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Error al rechazar pedido');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: '#fef3c7', text: '#92400e', label: 'Pendiente' },
      approved: { bg: '#d1fae5', text: '#065f46', label: 'Aprobado' },
      rejected: { bg: '#fee2e2', text: '#991b1b', label: 'Rechazado' }
    };

    const style = statusStyles[status] || statusStyles.pending;
    
    return (
      <span 
        className={styles.statusBadge}
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {style.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Package className={styles.titleIcon} />
          Pedidos Online
        </h1>
        
        <div className={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`}
          >
            Aprobados
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`${styles.filterBtn} ${filter === 'rejected' ? styles.active : ''}`}
          >
            Rechazados
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.ordersList}>
          {orders.length === 0 ? (
            <div className={styles.noOrders}>
              <Package className={styles.noOrdersIcon} />
              <h3>No hay pedidos</h3>
              <p>Los pedidos online aparecerán aquí</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3>Pedido #{order.id}</h3>
                    <p className={styles.customerName}>{order.customer_name}</p>
                  </div>
                  <div className={styles.orderMeta}>
                    {getStatusBadge(order.status)}
                    <span className={styles.orderTotal}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className={styles.orderDetails}>
                  <div className={styles.detailItem}>
                    <Calendar size={16} />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Mail size={16} />
                    <span>{order.customer_email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Phone size={16} />
                    <span>{order.customer_phone}</span>
                  </div>
                </div>

                <div className={styles.orderActions}>
                  <button
                    onClick={() => handleViewOrder(order)}
                    className={styles.viewBtn}
                  >
                    <Eye size={16} />
                    Ver detalles
                  </button>
                  
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className={styles.approveBtn}
                      >
                        <CheckCircle size={16} />
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className={styles.rejectBtn}
                      >
                        <X size={16} />
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedOrder && (
          <div className={styles.orderDetail}>
            <div className={styles.detailHeader}>
              <h2>Pedido #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.customerInfo}>
              <h3>Información del Cliente</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>Nombre:</strong>
                  <span>{selectedOrder.customer_name}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Email:</strong>
                  <span>{selectedOrder.customer_email}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Teléfono:</strong>
                  <span>{selectedOrder.customer_phone}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Dirección:</strong>
                  <span>{selectedOrder.customer_address}</span>
                </div>
                {selectedOrder.notes && (
                  <div className={styles.infoItem}>
                    <strong>Notas:</strong>
                    <span>{selectedOrder.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.itemsList}>
              <h3>Productos del Pedido</h3>
              {orderItems.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <h4>{item.products?.name || 'Producto eliminado'}</h4>
                    <p>Código: {item.products?.code || 'N/A'}</p>
                  </div>
                  <div className={styles.itemQuantity}>
                    Cantidad: {item.quantity}
                  </div>
                  <div className={styles.itemPrice}>
                    {formatPrice(item.price)} c/u
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              
              <div className={styles.orderTotal}>
                <strong>Total: {formatPrice(selectedOrder.total)}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
