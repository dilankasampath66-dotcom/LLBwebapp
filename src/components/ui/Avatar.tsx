import React from 'react';

export interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
  src?: string;
  fallback?: string;
  className?: string;
}

export function Avatar({ name = '', size = 'md', imageUrl, src, fallback, className = '' }: AvatarProps) {
  const displayName = name || fallback || '?';
  const imgUrl = imageUrl || src;

  const getInitials = (n: string) => {
    if (!n) return '?';
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const bgColor = stringToColor(displayName);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden text-white font-medium ${sizes[size]} ${className}`}
      style={{ backgroundColor: imgUrl ? 'transparent' : bgColor }}
    >
      {imgUrl ? (
        <img src={imgUrl} alt={displayName} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(displayName)}</span>
      )}
    </div>
  );
}

export default Avatar;
