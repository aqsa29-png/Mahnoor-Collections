// src/components/ProductGrid.js

import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map(prod => (
        <ProductCard key={prod.id} product={prod} />
      ))}
    </div>
  );
}

export default ProductGrid;
