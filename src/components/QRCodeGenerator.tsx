import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
}

export function QRCodeGenerator({ value }: QRCodeGeneratorProps) {
  return (
    <div className="flex justify-center">
      <QRCode value={value} size={256} bgColor="#ffffff" fgColor="#000000" level="Q" />
    </div>
  );
}
