import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}