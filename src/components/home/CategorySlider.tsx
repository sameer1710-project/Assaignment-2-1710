import React, { useRef } from 'react';
import { CATEGORIES } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategorySlider: React.FC = () => {
  const { setCategoryFilter, setActiveTab } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setActiveTab('restaurants');
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            What are you craving?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore authentic handpicked cuisines & specialties
          </p>
        </div>

        {/* Scroll Arrows for desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className="group flex flex-col items-center shrink-0 w-24 sm:w-28 text-center cursor-pointer snap-start focus:outline-none"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 group-hover:border-orange-400 group-hover:shadow-lg group-hover:shadow-orange-500/10 transition-all duration-300 mb-2">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1.5 right-1.5 text-xs bg-white/90 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                {cat.icon}
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate w-full">
              {cat.name}
            </span>
            <span className="text-[10px] text-slate-400">
              {cat.dishCount}+ options
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
