import React from 'react';
import { Check, X, Share2 } from 'lucide-react';

interface RideActionsProps {
  status: string;
  isSubmitting: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onTransfer: () => void;
}

export function RideActions({ 
  status, 
  isSubmitting, 
  onAccept, 
  onDecline, 
  onTransfer 
}: RideActionsProps) {
  if (status !== 'pending') return null;

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={onAccept}
        disabled={isSubmitting}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors disabled:opacity-50"
      >
        <Check className="w-4 h-4" />
        {isSubmitting ? 'Processing...' : 'Accept'}
      </button>
      <button
        onClick={onTransfer}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors disabled:opacity-50"
      >
        <Share2 className="w-4 h-4" />
        Transfer
      </button>
      <button
        onClick={onDecline}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        <X className="w-4 h-4" />
        Decline
      </button>
    </div>
  );
}