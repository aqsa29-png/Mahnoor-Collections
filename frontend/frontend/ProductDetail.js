import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{product.name}</h1>
      <img src={product.images[0]} alt={product.name} style={{ maxWidth: "400px", width: "100%", borderRadius: "8px" }} />
      <p>{product.description}</p>
      <p style={{ color: "#800000", fontWeight: "bold" }}>${product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)} style={{ background: "#800000", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "5px" }}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetail;
