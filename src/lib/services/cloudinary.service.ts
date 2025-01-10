// Replace these with your Cloudinary credentials
const CLOUDINARY_UPLOAD_PRESET = 'citybucketlist_drivers'; // The one you created above
const CLOUDINARY_CLOUD_NAME = 'dv0fkgpua';   // From your dashboard
const CLOUDINARY_API_KEY = '463943793553519';         // From your dashboard

interface CloudinaryResponse {
  secure_url: string;
  error?: {
    message: string;
  };
}

export const cloudinaryService = {
  async uploadImage(file: File): Promise<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image.');
    }

    // Validate file size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data: CloudinaryResponse = await response.json();
      
      if (!data.secure_url) {
        throw new Error('No URL received from Cloudinary');
      }

      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      if (error instanceof Error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
      throw new Error('Upload failed. Please try again.');
    }
  }
};
