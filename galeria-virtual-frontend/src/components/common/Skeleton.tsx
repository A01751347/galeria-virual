// src/components/common/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = 'full',
  height = '1rem',
  rounded = 'md',
  className = ''
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };
  
  const widthClass = typeof width === 'string' ? (width === 'full' ? 'w-full' : width) : `w-[${width}px]`;
  const heightClass = typeof height === 'string' ? (height === 'full' ? 'h-full' : height) : `h-[${height}px]`;
  
  return (
    <div 
      className={`bg-neutral-light animate-pulse ${widthClass} ${heightClass} ${roundedClasses[rounded]} ${className}`}
    />
  );
};

export default Skeleton;