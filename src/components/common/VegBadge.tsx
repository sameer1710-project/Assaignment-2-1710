import React from 'react';

interface VegBadgeProps {
  isVeg: boolean;
  size?: 'sm' | 'md';
}

export const VegBadge: React.FC<VegBadgeProps> = ({ isVeg, size = 'sm' }) => {
  const boxSize = size === 'sm' ? 'w-4 h-4 p-[2px]' : 'w-5 h-5 p-[3px]';
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  if (isVeg) {
    return (
      <span
        title="Pure Vegetarian"
        className={`inline-flex items-center justify-center border border-emerald-600 rounded-[3px] bg-emerald-50/50 ${boxSize} shrink-0`}
      >
        <span className={`rounded-full bg-emerald-600 ${dotSize}`} />
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center border border-rose-600 rounded-[3px] bg-rose-50/50 ${boxSize} shrink-0`}
    >
      <span
        className={`border-solid border-l-transparent border-r-transparent border-t-0 border-b-rose-600 ${
          size === 'sm' ? 'border-b-[7px] border-l-[4px] border-r-[4px]' : 'border-b-[9px] border-l-[5px] border-r-[5px]'
        }`}
      />
    </span>
  );
};
