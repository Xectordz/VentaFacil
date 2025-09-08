import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Mail, Phone, Package, Home } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import styles from './OrderConfirmation.module.css';

export default function OrderConfirmation() {
  const location = useLocation();
  const { orderId, customerEmail } = location.state || {};
  const { getContactSettings, getBusinessSettings } = useSettings();
  
  const contactInfo = getContactSettings();
  const businessInfo = getBusinessSettings();

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <CheckCircle size={64} />
        </div>
        
        <h1 className={styles.title}>¡Pedido Confirmado!</h1>
        
        <p className={styles.subtitle}>
          Tu pedido ha sido recibido y está siendo procesado
        </p>

        {orderId && (
          <div className={styles.orderDetails}>
            <h2>Detalles del Pedido</h2>
            <div className={styles.detailItem}>
              <Package className={styles.detailIcon} />
              <div>
                <strong>Número de pedido:</strong> #{orderId}
              </div>
            </div>
            {customerEmail && (
              <div className={styles.detailItem}>
                <Mail className={styles.detailIcon} />
                <div>
                  <strong>Email de confirmación enviado a:</strong> {customerEmail}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.nextSteps}>
          <h2>¿Qué sigue?</h2>
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Revisión del pedido</h3>
                <p>Nuestro equipo revisará tu pedido y verificará disponibilidad</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Confirmación</h3>
                <p>Te contactaremos para confirmar detalles y coordinar la entrega</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Entrega</h3>
                <p>Recibirás tu pedido en la dirección proporcionada</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h3>¿Necesitas ayuda?</h3>
          <p>Contacta con nosotros si tienes alguna pregunta sobre tu pedido o necesitas realizar algún cambio</p>
          <div className={styles.contactOptions}>
            {contactInfo.phone && (
              <a href={`tel:${contactInfo.phone}`} className={styles.contactOption}>
                <Phone className={styles.contactIcon} />
                <div>
                  <strong>Teléfono:</strong>
                  <p>{contactInfo.phone}</p>
                </div>
              </a>
            )}
            
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`} className={styles.contactOption}>
                <Mail className={styles.contactIcon} />
                <div>
                  <strong>Email:</strong>
                  <p>{contactInfo.email}</p>
                </div>
              </a>
            )}
            
            {/* Mostrar mensaje si no hay información de contacto */}
            {!contactInfo.phone && !contactInfo.email && (
              <div className={styles.noContactInfo}>
                <p>La información de contacto se está configurando. Por favor, revisa tu correo electrónico para más detalles.</p>
              </div>
            )}
            
            {/* Mostrar información adicional si está disponible */}
            {contactInfo.address && (
              <div className={styles.contactOption}>
                <Package className={styles.contactIcon} />
                <div>
                  <strong>Dirección:</strong>
                  <p>{contactInfo.address}</p>
                </div>
              </div>
            )}
            
            {contactInfo.hours && (
              <div className={styles.contactOption}>
                <CheckCircle className={styles.contactIcon} />
                <div>
                  <strong>Horarios de atención:</strong>
                  <p>{contactInfo.hours}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Mostrar mensaje personalizado del negocio */}
          {businessInfo.confirmationMessage && (
            <div className={styles.businessMessage}>
              <p>"{businessInfo.confirmationMessage}"</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/tienda" className={styles.primaryButton}>
            <Package size={20} />
            Seguir comprando
          </Link>
          
          <Link to="/" className={styles.secondaryButton}>
            <Home size={20} />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
