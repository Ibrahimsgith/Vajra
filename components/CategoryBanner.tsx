import React from 'react';
import { Page } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface CategoryBannerProps {
  onNavigate: (page: Page) => void;
}

const categories = [
  { name: 'Chains', imageUrl: 'https://raw.githubusercontent.com/Ibrahimsgith/Vajra/main/Chain.png', page: 'chains' as Page },
  { name: 'Bracelets', imageUrl: 'https://raw.githubusercontent.com/Ibrahimsgith/Vajra/main/Bracelet.png', page: 'bracelets' as Page },
  { name: 'Earrings', imageUrl: 'https://raw.githubusercontent.com/Ibrahimsgith/Vajra/main/Earrings.png', page: 'earrings' as Page },
  { name: 'Rings', imageUrl: 'https://raw.githubusercontent.com/Ibrahimsgith/Vajra/main/Ring.png', page: 'rings' as Page },
];

const AnimatedCategoryItem: React.FC<{ category: typeof categories[0]; onNavigate: (page: Page) => void; index: number }> = ({ category, onNavigate, index }) => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      key={category.name}
      className={`group relative h-96 overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => onNavigate(category.page)}
    >
      <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-serif text-white">{category.name}</h3>
        <div className="text-white font-semibold text-sm mt-2 inline-block border-b border-transparent group-hover:border-white transition-all">
          Shop Now &rarr;
        </div>
      </div>
    </div>
  );
}

export const CategoryBanner: React.FC<CategoryBannerProps> = ({ onNavigate }) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-20 bg-[#5c1f2b]">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-12 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-serif text-white">Shop by Category</h2>
          <p className="text-white/80 mt-2">Find your next treasure in our curated collections.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <AnimatedCategoryItem key={category.name} category={category} onNavigate={onNavigate} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};