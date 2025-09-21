import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-maroon text-white flex justify-between items-center px-8 py-4">
      <div className="text-2xl font-bold">
        <Link to="/">Mahnoor Collection</Link>
      </div>
      <div className="space-x-6 text-lg">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/shop" className="hover:text-gray-300">Shop</Link>
        <Link to="/cart" className="hover:text-gray-300">Cart</Link>
      </div>
    </nav>
  );
}

export default Navbar;
