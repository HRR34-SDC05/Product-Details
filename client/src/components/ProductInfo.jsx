import React from "react";
import styles from "../style.css.js";
import Star from "./StarRatings.jsx";

const ProductInfo = ({ product }) => (
  <div className="product-info-wrapper" style={styles.ProductInfo}>
    <Star product={product} />
    <div style={styles.rating}>{product.rating}</div>
    <div style={styles.reviewCount}>({product.review_count})</div>
    <div style={styles.itemWrapper}>
      <div style={styles.itemNum}>Item #{product.item_num}</div>
    </div>
  </div>
);

export default ProductInfo;
