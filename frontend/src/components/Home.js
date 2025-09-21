import React from "react";
import HeroBanner from "./herobanner";
import ProductCard from "./ProductCard";

function Home() {
  const products = [
    { id: 1, name: "Marwah 2pc", image: "https://via.placeholder.com/300", price: 7500, salePrice: 3350 },
    { id: 2, name: "Valentina 2pc", image: "https://via.placeholder.com/300", price: 7000, salePrice: 3350 },
    { id: 3, name: "Zara Dress", image: "https://via.placeholder.com/300", price: 5000 }
  ];

  return (
    <div>
      <HeroBanner />
      <h2 className="text-3xl font-bold text-center text-maroon mt-8 mb-4">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-8 mb-8">
        {products.map(prod => <ProductCard key={prod.id} product={prod} />)}
      </div>
    </div>
  );
}

export default Home;
