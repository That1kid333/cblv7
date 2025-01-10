import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { DEFAULT_PROFILE_IMAGE } from '../constants/images';

interface ProfileImageProps {
  photo: string;
  isEditing: boolean;
  onImageChange: (file: File) => void;
}

export function ProfileImage({ photo, isEditing, onImageChange }: ProfileImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          onImageChange(file);
        } else {
          alert('Image size must be less than 5MB.');
        }
      } else {
        alert('Please select a valid image file (PNG, JPG, JPEG, etc).');
      }
    }
  };

  return (
    <div className="relative group">
      <img
        src={photo || DEFAULT_PROFILE_IMAGE}
        alt="Profile"
        className="w-24 h-24 rounded-lg object-cover bg-neutral-800"
      />
      {isEditing && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-[#C69249] rounded-full hover:bg-[#B58238] transition-colors"
            title="Change profile photo"
          >
            <Camera className="w-4 h-4 text-white" />
          </button>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
            {photo !== DEFAULT_PROFILE_IMAGE && (
              <div className="opacity-0 group-hover:opacity-100 text-white text-xs text-center p-2">
                Click camera icon to change photo
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}