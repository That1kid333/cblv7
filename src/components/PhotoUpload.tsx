import React, { useRef, useState } from 'react';
import { Upload, User, Loader2 } from 'lucide-react';
import { cloudinaryService } from '../lib/services/cloudinary.service';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string) => void;
  userId: string;
}

export function PhotoUpload({ currentPhotoUrl, onPhotoChange, userId }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      // Upload to Cloudinary - validation is now handled in the service
      const imageUrl = await cloudinaryService.uploadImage(file);
      
      // Call the callback with the new URL
      onPhotoChange(imageUrl);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload photo');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Error message */}
      {error && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
          {error}
        </div>
      )}
      
      <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center">
        {currentPhotoUrl ? (
          <img
            src={currentPhotoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-12 h-12 text-neutral-400" />
        )}
      </div>
      
      <button
        onClick={() => {
          setError(null);
          fileInputRef.current?.click();
        }}
        disabled={isUploading}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Upload className="w-6 h-6 text-white" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
}
