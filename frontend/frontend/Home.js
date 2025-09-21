import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get("/api/products/featured").then((res) => setFeatured(res.data));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Featured Dresses</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
        {featured.map((p) => (
          <Link key={p._id} to={`/shop/${p._id}`} style={{ border: "1px solid #555", borderRadius: "8px", padding: "1rem", textDecoration: "none", color: "black" }}>
            <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <h3>{p.name}</h3>
            <p style={{ color: "#800000", fontWeight: "bold" }}>${p.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
