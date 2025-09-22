import React from "react";

function HeroBanner() {
  return (
    <div className="relative w-full h-96">
      <img
        src="https://via.placeholder.com/1200x400.png?text=Mahnoor+Collection+Banner"
        alt="Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold mb-4">Discover Your Style</h1>
        <p className="text-lg">Shop the latest fashion collection now!</p>
      </div>
    </div>
  );
}

export default HeroBanner;
