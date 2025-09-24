
import React from 'react';
import { Hero } from './Hero';
import { CategoryBanner } from './CategoryBanner';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <Hero />
      <CategoryBanner onNavigate={onNavigate} />
    </>
  );
};
