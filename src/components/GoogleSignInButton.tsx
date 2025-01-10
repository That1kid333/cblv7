import React from 'react';
import { Mail } from 'lucide-react';

interface GoogleSignInButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  text?: string;
}

export function GoogleSignInButton({ 
  onClick, 
  isLoading, 
  disabled = false,
  text = "Continue with Gmail" 
}: GoogleSignInButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onClick();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className="w-full mb-6 p-4 bg-white text-black rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-100 transition-colors disabled:opacity-50"
    >
      <Mail className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? "Signing in..." : text}
    </button>
  );
}