import React from "react";

function ProductCard({ product }) {
  return (
    <div className="bg-white shadow-md rounded-md p-4 hover:shadow-xl transition">
      <img src={product.image} alt={product.name} className="h-48 w-full object-cover rounded-md"/>
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-maroon font-bold">
        Rs.{product.salePrice ? product.salePrice : product.price}
        {product.salePrice && (
          <span className="line-through text-gray-400 ml-2">Rs.{product.price}</span>
        )}
      </p>
    </div>
  );
}

export default ProductCard;
