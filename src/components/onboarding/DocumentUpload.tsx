import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Check, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  label: string;
  accept: Record<string, string[]>;
  onUpload: (file: File) => Promise<void>;
  isUploaded?: boolean;
  error?: string;
}

export function DocumentUpload({ 
  label, 
  accept, 
  onUpload, 
  isUploaded = false,
  error 
}: DocumentUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-300">
        {label}
      </label>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#F5A623] bg-[#F5A623]/10' : 'border-neutral-700 hover:border-[#F5A623]'}
          ${isUploaded ? 'bg-green-500/10 border-green-500' : ''}
          ${error ? 'bg-red-500/10 border-red-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2">
          {isUploaded ? (
            <>
              <Check className="w-8 h-8 text-green-500" />
              <p className="text-green-500">Document uploaded successfully</p>
            </>
          ) : error ? (
            <>
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-red-500">{error}</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-[#F5A623]" />
              <p className="text-neutral-400">
                {isDragActive
                  ? "Drop the file here"
                  : "Drag and drop your file here, or click to select"}
              </p>
              <p className="text-sm text-neutral-500">
                Maximum file size: 5MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}