import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const total = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);

  if (cart.length === 0) return <div style={{ padding: "2rem" }}><h1>Your Cart is Empty</h1></div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Shopping Cart</h1>
      {cart.map((p) => (
        <div key={p._id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1rem" }}>
          <h3>{p.name}</h3>
          <p>${p.price.toFixed(2)}</p>
          <input type="number" value={p.quantity} min="1" onChange={(e) => updateQuantity(p._id, parseInt(e.target.value))} />
          <button onClick={() => removeFromCart(p._id)} style={{ marginLeft: "1rem", background: "red", color: "white", padding: "0.3rem 0.6rem", border: "none", borderRadius: "5px" }}>
            Remove
          </button>
        </div>
      ))}
      <h2>Total: ${total.toFixed(2)}</h2>
    </div>
  );
}

export default Cart;
