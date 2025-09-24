import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const faqData = [
  {
    question: "What materials are your jewelry made of?",
    answer: "Our jewelry is crafted from high-quality materials, including 18k gold, platinum, sterling silver, and ethically sourced gemstones. Each product description contains detailed information about the specific materials used."
  },
  {
    question: "How do I care for my jewelry?",
    answer: "To keep your jewelry looking its best, we recommend storing it in a dry, safe place like a jewelry box. Avoid direct contact with chemicals, lotions, and perfumes. For cleaning, use a soft, lint-free cloth. For deeper cleaning, please consult a professional jeweler."
  },
  {
    question: "What is your shipping policy?",
    answer: "We offer complimentary standard shipping on all orders over $500. For orders below this amount, a standard shipping fee applies. Expedited shipping options are available at checkout for an additional cost. Orders are typically processed within 1-2 business days."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns on unworn items in their original condition and packaging within 30 days of purchase. To initiate a return, please contact our customer service team. Please note that custom or personalized items are final sale."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Please be aware that customers are responsible for any customs duties or taxes imposed by their country."
  }
];

const AccordionItem: React.FC<{
  item: typeof faqData[0];
  isOpen: boolean;
  onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 text-left font-serif text-lg text-white"
        aria-expanded={isOpen}
      >
        <span>{item.question}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <div className="pb-5 pr-10 text-white/80">
                {item.answer}
            </div>
        </div>
      </div>
    </div>
  );
};


export const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleItemClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <div className="bg-[#5c1f2b] py-20 animate-fade-in">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white">Frequently Asked Questions</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">Find answers to common questions about our products, policies, and more.</p>
        </div>
        <div className="bg-[#4a1922] border border-white/10 rounded-lg p-4 sm:p-8">
            {faqData.map((item, index) => (
                <AccordionItem 
                    key={index}
                    item={item}
                    isOpen={openIndex === index}
                    onClick={() => handleItemClick(index)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};