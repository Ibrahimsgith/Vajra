
import React from 'react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-white py-20 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif text-amber-900 mb-6">Our Story</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            VAJRA was born from a passion for timeless beauty and a deep respect for the art of jewelry making. Our name, meaning "diamond" and "thunderbolt" in Sanskrit, reflects our commitment to creating pieces of both unyielding strength and breathtaking brilliance.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img src="https://picsum.photos/seed/jewelry-artisan/600/700" alt="Craftsmanship" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-amber-800 mb-4">The Art of Craftsmanship</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Each VAJRA creation is meticulously handcrafted by master artisans who have dedicated their lives to perfecting their craft. We source only the finest, ethically-sourced metals and gemstones, ensuring that every piece not only looks magnificent but also aligns with our values of responsibility and integrity.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From the initial sketch to the final polish, we pour our hearts into every detail. Our design philosophy blends classic elegance with a modern sensibility, resulting in jewelry that is both contemporary and timeless—designed to be worn, loved, and passed down through generations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};