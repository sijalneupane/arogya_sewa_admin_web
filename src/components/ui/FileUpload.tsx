import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, X, FileText, Eye, RefreshCw } from 'lucide-react';
import { fileApi, FileTypeEnum, FileUploadResponse } from '@/api/fileupload.api';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export interface UploadedFile {
  file_id: string;
  file_type: string;
  file_url?: string;
  meta_type?: string;
}

interface FileUploadProps {
  onFileUploaded: (fileData: { file_id: string; file_type: string } | null) => void;
  initialFile?: UploadedFile | null;
  accept?: string;
  maxSizeMB?: number;
  fileType?: FileTypeEnum;
}

function isImage(file: UploadedFile) {
  return file.meta_type?.startsWith('image') ?? false;
}

function isPdf(file: UploadedFile) {
  return (
    file.meta_type === 'application/pdf' ||
    file.meta_type === 'pdf' ||
    file.file_type === 'pdf' ||
    file.file_url?.toLowerCase().endsWith('.pdf') === true
  );
}

export function FileUpload({
  onFileUploaded,
  initialFile = null,
  accept = 'image/*,.pdf',
  maxSizeMB = 5,
  fileType = FileTypeEnum.LICENSE,
}: FileUploadProps) {
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(initialFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      if (currentFile?.file_id) {
        return fileApi.update(currentFile.file_id, file, fileType) as unknown as Promise<FileUploadResponse>;
      }
      return fileApi.upload(file, fileType) as unknown as Promise<FileUploadResponse>;
    },
    onSuccess: (uploaded) => {
      const newFile: UploadedFile = {
        file_id: uploaded.file_id,
        file_type: uploaded.file_type,
        file_url: uploaded.file_url,
        meta_type: uploaded.meta_type,
      };
      setCurrentFile(newFile);
      onFileUploaded({ file_id: uploaded.file_id, file_type: uploaded.file_type });
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => fileApi.delete(fileId),
    onSuccess: () => {
      setCurrentFile(null);
      onFileUploaded(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('File removed');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to remove file';
      toast.error(errorMessage);
    },
  });

  const validateAndUpload = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    const allowedTypes = accept.split(',').map((t) => t.trim());
    const matched = allowedTypes.some((t) => {
      if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', '/'));
      return file.type === t || file.name.endsWith(t.replace('.', ''));
    });
    if (!matched) {
      toast.error(`Invalid file type. Allowed: ${accept}`);
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    if (currentFile?.file_id) {
      deleteMutation.mutate(currentFile.file_id);
    } else {
      setCurrentFile(null);
      onFileUploaded(null);
    }
  };

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  const renderViewButton = () => {
    if (!currentFile?.file_url) return null;
    if (isImage(currentFile)) {
      return (
        <ImagePreview src={currentFile.file_url} alt="File preview" title="File Preview">
          <Button type="button" variant="outline" size="sm" className="w-60">
            <Eye className="h-4 w-4 mr-1" />
            View File
          </Button>
        </ImagePreview>
      );
    }
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-60"
        onClick={() => window.open(currentFile.file_url, '_blank', 'noopener,noreferrer')}
      >
        <Eye className="h-4 w-4 mr-1" />
        View File
      </Button>
    );
  };

  return (
    <div className="space-y-2">
      {/* Upload area / preview - fixed 240x240 (w-60 h-60) */}
      {currentFile ? (
        <div className="relative group w-60 h-60 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          {isImage(currentFile) && currentFile.file_url ? (
            <img
              src={currentFile.file_url}
              alt="Uploaded file"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
              <FileText className="h-12 w-12 text-blue-500" />
              <p className="text-xs text-gray-600 text-center break-all line-clamp-3">
                {isPdf(currentFile) ? 'PDF document' : (currentFile.meta_type || currentFile.file_type)}
              </p>
            </div>
          )}

          {/* Hover overlay with Replace / Remove */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
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
              {deleteMutation.isPending ? 'Removing…' : 'Remove'}
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
          className="w-60 h-60 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Uploading…</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 text-center px-2">
                <span className="font-medium text-blue-600">Click to upload</span>
              </p>
              <p className="text-xs text-gray-400 mt-1 text-center px-2">
                {accept.replace(/,/g, ', ')} up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      {/* View button below the area - same width as frame (w-60) */}
      {currentFile && renderViewButton()}

      {/* Error feedback */}
      {uploadMutation.isError && (
        <p className="text-xs text-red-600">Upload failed. Please try again.</p>
      )}
      {deleteMutation.isError && (
        <p className="text-xs text-red-600">Remove failed. Please try again.</p>
      )}
    </div>
  );
}
