import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Camera, Eye, Upload, Trash2 } from 'lucide-react';
import { AvatarPlaceholder } from '@/components/ui/AvatarPlaceholder';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { fileApi, FileTypeEnum, FileUploadResponse } from '@/api/fileupload.api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import toast from 'react-hot-toast';

export interface ProfileImagePickerProps {
  imageId: string;
  imageUrl?: string;
  name: string;
  onChange: (imageId: string, response?: FileUploadResponse) => void;
  targetUserId?: string; // Target user ID for file update API
}

export default function ProfileImagePicker({
  imageId,
  imageUrl,
  name,
  onChange,
  targetUserId,
}: ProfileImagePickerProps) {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const displayUrl = previewUrl || imageUrl;

  const uploadMutation = useMutation<FileUploadResponse, unknown, File>({
    mutationFn: async (file: File) => {
      if (imageId) {
        const result = await fileApi.update(imageId, file, FileTypeEnum.PROFILE, targetUserId);
        return result as unknown as FileUploadResponse;
      }
      const result = await fileApi.upload(file, FileTypeEnum.PROFILE);
      return result as unknown as FileUploadResponse;
    },
    onSuccess: (response) => {
      setPreviewUrl(response.file_url);
      onChange(response.file_id, response);
      toast.success('Profile image updated successfully');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to upload image';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fileApi.delete(id),
    onSuccess: () => {
      setPreviewUrl('');
      onChange('', undefined);
      if (user) {
        setUser({ ...user, profile_img: null });
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Profile image removed');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to remove image';
      toast.error(message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadMutation.mutate(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
      {/* Avatar */}
      <div className="relative group">
        <AvatarPlaceholder
          name={name}
          imageUrl={displayUrl}
          size="md"
          shape="circle"
          className="ring-4 ring-white shadow-xl border border-gray-100 h-28 w-28"
        />

        {/* Hover overlay with camera icon */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>

        {/* Uploading spinner */}
        {uploadMutation.isPending && (
          <div className="absolute inset-0 rounded-full bg-white/70 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="text-center sm:text-left space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-500">JPG, GIF or PNG. Maximum size of 2MB.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClick}
            disabled={isLoading}
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            {imageId ? 'Replace' : 'Upload'}
          </Button>

          {displayUrl && (
            <ImagePreview src={displayUrl} alt="Profile photo" title="Profile photo">
              <Button type="button" size="sm" variant="outline" disabled={isLoading}>
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
            </ImagePreview>
          )}

          {imageId && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowRemoveConfirm(true)}
              disabled={isLoading}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />

      {/* Remove confirmation */}
      <ConfirmationDialog
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title="Remove profile photo"
        description="Are you sure you want to remove your profile photo?"
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          if (imageId) deleteMutation.mutate(imageId);
        }}
      />
    </div>
  );
}
