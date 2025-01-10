import React from 'react';

interface StatusMessageProps {
  status: 'success' | 'error' | 'idle';
  errorMessage?: string;
}

export function StatusMessage({ status, errorMessage }: StatusMessageProps) {
  if (status === 'idle') return null;

  const isSuccess = status === 'success';
  const baseClasses = "mb-4 p-4 rounded-lg text-center";
  const statusClasses = isSuccess
    ? "bg-green-500/10 border border-green-500 text-green-500"
    : "bg-red-500/10 border border-red-500 text-red-500";

  return (
    <div className={`${baseClasses} ${statusClasses}`}>
      {isSuccess
        ? "Ride scheduled successfully! We'll contact you shortly."
        : errorMessage || "Failed to schedule ride. Please try again."}
    </div>
  );
}