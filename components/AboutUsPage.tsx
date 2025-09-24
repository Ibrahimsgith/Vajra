import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const AboutUsPage: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div className="bg-[#5c1f2b] py-20">
      <div className="container mx-auto px-6">
        <div 
          ref={ref}
          className={`max-w-4xl mx-auto text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <h1 className="text-5xl font-serif text-white mb-6">Our Story</h1>
          <div className="text-lg text-white/90 leading-relaxed mb-8 space-y-6">
            <p>
              Welcome to Vajra - where every piece is a whisper of heritage, a touch of elegance, and a token of love.
            </p>
            <p>
              Vajra was born from a shared passion between three women - a mother and her daughters - who believe that jewellery is not just an accessory, but a story. A story of strength, beauty, and timeless grace. Together, we lovingly handpick every design, ensuring that what reaches you is not only aesthetically exquisite but also crafted with care and soul.
            </p>
            <p>
              We know what it feels like to search for something just right that perfect piece that doesn't break the bank but still makes your heart skip a beat. That's why we bring you high-quality, antique-inspired jewellery at prices that are refreshingly low. We believe elegance shouldn't come at a premium - it should come from the heart.
            </p>
            <p>
              Every jewellery in our collection is thoughtfully chosen to reflect grace in every detail. Whether you're dressing up for a wedding, a festival, or simply adorning your everyday beauty - Vajra is here to make you feel divine. From our hearts to your jewellery box this is not just a collection, it's a legacy of love.
            </p>
            <p className="italic">
              With warmth,
              <br />
              The Vajra Women
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};