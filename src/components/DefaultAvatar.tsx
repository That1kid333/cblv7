import React from 'react';

interface DefaultAvatarProps {
  name: string;
  className?: string;
}

export function DefaultAvatar({ name, className = "w-12 h-12" }: DefaultAvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className={`${className} rounded-full bg-neutral-700 flex items-center justify-center text-white font-medium`}
    >
      {initials}
    </div>
  );
}
