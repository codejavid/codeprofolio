'use client';

import { useState } from 'react';

interface AvatarDisplayProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarDisplay({ 
  src, 
  name, 
  email, 
  size = 'md',
  className = '' 
}: AvatarDisplayProps) {
  const [error, setError] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  // Fallback: Generate initials avatar
  const displayName = name || email || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Fallback URL with UI Avatars
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4F46E5&color=fff&size=128`;

  // If image fails to load or no src provided
  if (error || !src) {
    return (
      <div 
        className={`${sizeClasses[size]} ${className} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={displayName}
      className={`${sizeClasses[size]} ${className} rounded-full border-2 border-gray-200 object-cover`}
      onError={() => setError(true)}
    />
  );
}