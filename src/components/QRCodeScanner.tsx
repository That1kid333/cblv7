import React from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const handleScan = async () => {
    try {
      const qrCodeRef = doc(db, 'qrCodes', 'driverId'); // Replace 'driverId' with the actual driver ID
      const qrCodeDoc = await getDoc(qrCodeRef);
      if (qrCodeDoc.exists()) {
        const scannedData = qrCodeDoc.data().value;
        onScan(scannedData);
      } else {
        console.error('No QR code found for this driver');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
    }
  };

  return (
    <div className="qr-code-scanner">
      <button
        onClick={handleScan}
        className="p-4 bg-[#C69249] text-white rounded-lg text-xl font-bold hover:bg-[#B58238] transition-colors"
      >
        Scan QR Code
      </button>
    </div>
  );
};

export default QRCodeScanner;
