import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { cart } = useContext(CartContext);

  return (
    <nav style={{ padding: "1rem", background: "#000", color: "#fff" }}>
      <Link to="/" style={{ color: "#800000", fontWeight: "bold", fontSize: "1.5rem" ,fontFamily:"fantasy"}}>
        Mahnoor Collections
      </Link>
      <span style={{ marginLeft: "2rem" }}>
        <Link to="/" style={{ color: "#fff", marginRight: "1rem" }}>Home</Link>
        <Link to="/shop" style={{ color: "#fff", marginRight: "1rem" }}>Shop</Link>
        <Link to="/cart" style={{ color: "#fff" }}>
          Cart ({cart.reduce((acc, p) => acc + p.quantity, 0)})
        </Link>
      </span>
    </nav>
  );
}

export default Navbar;
