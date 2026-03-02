import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { fileApi, FileTypeEnum } from '@/api/fileupload.api';
import { Button } from '@/components/ui/button';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { Upload, X, Image as ImageIcon, Eye } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string; // Image ID
  onChange: (imageId: string) => void;
  fileType?: FileTypeEnum;
  error?: string;
  accept?: string;
  className?: string;
  initialImageUrl?: string; // URL to display for existing image
}

export default function ImageUpload({
  label,
  value,
  onChange,
  fileType = FileTypeEnum.OTHER,
  error,
  accept = 'image/*',
  className = '',
  initialImageUrl,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>('');
  
  // Determine the image to display: new preview takes priority, then initial URL
  const displayImageUrl = preview || initialImageUrl;
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => fileApi.delete(imageId),
    onSuccess: () => {
      setPreview('');
      setFileName('');
      onChange('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      // If there's an existing image ID, update it, otherwise upload new
      if (value) {
        return fileApi.update(value, file, fileType);
      }
      return fileApi.upload(file, fileType);
    },
    onSuccess: (response) => {
      console.log('Image upload successful:', response);
      console.log('Setting file_id:', response.file_id);
      onChange(response.file_id);
      // Extract filename from URL since it's not in the response
      const name = response.file_url.split('/').pop() || 'uploaded-image';
      setFileName(name);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadMutation.mutate(file);
  };

  const handleRemove = () => {
    if (value) {
      // Call delete API; cleanup happens in onSuccess
      deleteMutation.mutate(value);
    } else {
      // No server file yet (local preview only), just clear local state
      setPreview('');
      setFileName('');
      onChange('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      <div className="space-y-3">
        {/* Preview or Upload Area */}
        {displayImageUrl || value ? (
          <div className="relative group">
            {displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt="Preview"
                className="w-full h-48 object-contain rounded-lg border bg-gray-50"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
              <Button
                type="button"
                size="sm"
                onClick={handleClick}
                disabled={uploadMutation.isPending || deleteMutation.isPending}
              >
                <Upload className="w-4 h-4 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={uploadMutation.isPending || deleteMutation.isPending}
              >
                <X className="w-4 h-4 mr-1" />
                {deleteMutation.isPending ? 'Removing...' : 'Remove'}
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* View Image button */}
        {displayImageUrl && (
          <ImagePreview src={displayImageUrl} alt={label} title={label}>
            <Button type="button" variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-1" />
              View Image
            </Button>
          </ImagePreview>
        )}

        {/* File name and status */}
        {fileName && (
          <p className="text-sm text-gray-600">
            {fileName}
          </p>
        )}
        
        {uploadMutation.isPending && (
          <p className="text-sm text-blue-600">Uploading...</p>
        )}
        
        {uploadMutation.isError && (
          <p className="text-sm text-red-600">
            Upload failed. Please try again.
          </p>
        )}

        {deleteMutation.isError && (
          <p className="text-sm text-red-600">
            Delete failed. Please try again.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
