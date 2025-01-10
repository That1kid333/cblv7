import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full p-4 bg-[#F5A623] text-white rounded-lg text-xl font-bold hover:bg-[#E09612] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-black"
    >
      {isLoading ? 'SCHEDULING...' : 'SCHEDULE'}
    </button>
  );
}