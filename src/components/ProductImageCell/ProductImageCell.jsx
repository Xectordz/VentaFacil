import React from 'react';
import styles from './ProductImageCell.module.css';

const ProductImageCell = ({ product }) => {
  if (!product.image_url) {
    return (
      <div className={styles.noImageCell}>
        <span className={styles.noImageIcon}>📦</span>
        <span className={styles.noImageText}>Sin imagen</span>
      </div>
    );
  }

  return (
    <div className={styles.imageCell}>
      <img 
        src={product.image_url} 
        alt={product.name}
        className={styles.productThumbnail}
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `
            <div class="${styles.noImageCell}">
              <span class="${styles.noImageIcon}">❌</span>
              <span class="${styles.noImageText}">Error</span>
            </div>
          `;
        }}
      />
    </div>
  );
};

export default ProductImageCell;
