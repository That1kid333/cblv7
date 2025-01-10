import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../hooks/useAuth';

export function ReferralCode() {
  const { driver } = useAuth();
  const [copied, setCopied] = useState(false);
  
  if (!driver) return null;
  
  const referralUrl = `${window.location.origin}/referral?referral=${driver.id}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Your Referral Code</h2>
      
      <div className="flex flex-col items-center space-y-6">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={referralUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        
        {/* Share Link */}
        <div className="w-full">
          <div className="flex items-center gap-2 bg-neutral-700 p-2 rounded">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="bg-transparent flex-1 text-sm text-neutral-300 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1 bg-[#F5A623] text-black rounded hover:bg-[#E69612] transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm text-neutral-400 mt-2">
            Share this link with potential riders. When they sign up using your link,
            they'll be connected to your driver profile.
          </p>
        </div>
      </div>
    </div>
  );
}
