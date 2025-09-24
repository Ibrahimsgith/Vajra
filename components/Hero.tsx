
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white hero-bg">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 p-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold font-serif mb-4 tracking-wide">
          Exquisite by Design
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 font-light">
          Discover the timeless elegance of Vajra. Each piece, a testament to craftsmanship and beauty, designed to be cherished for a lifetime.
        </p>
        <button className="bg-white/10 backdrop-blur-sm border border-white/50 text-white font-semibold py-3 px-10 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          Explore The Collections
        </button>
      </div>
    </section>
  );
};
