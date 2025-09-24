
import React from 'react';

const categories = [
  { name: 'Rings', imageUrl: 'https://picsum.photos/seed/luxury-rings-collection/600/800' },
  { name: 'Necklaces', imageUrl: 'https://picsum.photos/seed/elegant-necklaces/600/800' },
  { name: 'Bracelets', imageUrl: 'https://picsum.photos/seed/fine-bracelets/600/800' },
  { name: 'Earrings', imageUrl: 'https://picsum.photos/seed/designer-earrings/600/800' },
];

export const CategoryBanner: React.FC = () => {
  return (
    <section className="py-20 bg-[#FDFBF8]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-amber-900">Shop by Category</h2>
          <p className="text-gray-600 mt-2">Find your next treasure in our curated collections.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <div key={category.name} className="group relative h-96 overflow-hidden rounded-lg shadow-md">
              <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-serif text-white">{category.name}</h3>
                <a href="#" className="text-white font-semibold text-sm mt-2 inline-block border-b border-transparent group-hover:border-white transition-all">
                  Shop Now &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};