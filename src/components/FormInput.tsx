import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function FormInput({ label, className = '', ...props }: FormInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white text-black border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69249] ${className}`}
        {...props}
      />
    </div>
  );
}