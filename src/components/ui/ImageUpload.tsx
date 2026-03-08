import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { fileApi, FileTypeEnum, FileUploadResponse } from '@/api/fileupload.api';
import { Button } from '@/components/ui/button';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { Upload, X, Image as ImageIcon, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export interface ImageUploadProps {
  label: string;
  value?: string; // Image ID
  onChange: (imageId: string) => void;
  fileType?: FileTypeEnum;
  error?: string;
  accept?: string;
  className?: string;
  initialImageUrl?: string; // URL to display for existing image
  maxSizeMB?: number;
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
  maxSizeMB = 2,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>('');
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
    onError: (err: any) => {
      const errorMessage = err?.message || 'Failed to remove image';
      toast.error(errorMessage);
    },
  });

  const uploadMutation = useMutation<FileUploadResponse, any, File>({
    mutationFn: async (file: File) => {
      // If there's an existing image ID, update it, otherwise upload new
      if (value) {
        const result = await fileApi.update(value, file, fileType);
        return result as unknown as FileUploadResponse;
      }
      const result = await fileApi.upload(file, fileType);
      return result as unknown as FileUploadResponse;
    },
    onSuccess: (response) => {
      console.log('Image upload successful:', response);
      console.log('Setting file_id:', response.file_id);
      onChange(response.file_id);
      // Extract filename from URL since it's not in the response
      const name = response.file_url.split('/').pop() || 'uploaded-image';
      setFileName(name);
      toast.success('Image uploaded successfully');
    },
    onError: (err: any) => {
      console.error('Upload error:', err);
      const errorMessage = err?.message || 'Failed to upload image';
      toast.error(errorMessage);
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
      deleteMutation.mutate(value);
    } else {
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

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;
  const displayImageUrl = preview || initialImageUrl;

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="space-y-2">
        {/* Upload area / preview - fixed 240x240 (w-60 h-60) */}
        {displayImageUrl || value ? (
          <div className="relative group w-60 h-60 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            {displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Hover overlay with Replace / Remove */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleClick}
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={isLoading}
              >
                <X className="h-3 w-3 mr-1" />
                {deleteMutation.isPending ? 'Removing...' : 'Remove'}
              </Button>
            </div>

            {/* Uploading indicator */}
            {uploadMutation.isPending && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="w-60 h-60 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            {uploadMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center px-2">
                  <span className="font-medium text-blue-600">Click to upload</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 text-center px-2">
                  PNG, JPG up to {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* View Image button - same width as image frame (w-60) */}
        {displayImageUrl && (
          <ImagePreview src={displayImageUrl} alt={label} title={label}>
            <Button type="button" variant="outline" size="sm" className="w-60">
              <Eye className="w-4 h-4 mr-1" />
              View Image
            </Button>
          </ImagePreview>
        )}

        {/* File name and status */}
        {fileName && (
          <p className="text-sm text-gray-600">{fileName}</p>
        )}

        {uploadMutation.isPending && (
          <p className="text-sm text-blue-600">Uploading...</p>
        )}

        {uploadMutation.isError && (
          <p className="text-xs text-red-600">Upload failed. Please try again.</p>
        )}

        {deleteMutation.isError && (
          <p className="text-xs text-red-600">Remove failed. Please try again.</p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
