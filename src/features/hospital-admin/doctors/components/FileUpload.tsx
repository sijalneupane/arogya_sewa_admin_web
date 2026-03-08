import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { fileApi, FileTypeEnum } from '@/api/fileupload.api';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileUploaded: (fileData: { file_id: string; file_type: string } | null) => void;
  initialFile?: { file_id: string; file_type: string } | null;
  accept?: string;
  maxSizeMB?: number;
  fileType?: FileTypeEnum;
}

export function FileUpload({
  onFileUploaded,
  initialFile = null,
  accept = 'image/*,.pdf',
  maxSizeMB = 5,
  fileType = FileTypeEnum.LICENSE,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<{
    file_id: string;
    file_type: string;
    file_url?: string;
    meta_type?: string;
  } | null>(initialFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = accept.split(',').map((type) => type.trim());
    const fileTypeMatch = allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type || file.name.endsWith(type.replace('.', ''));
    });

    if (!fileTypeMatch) {
      toast.error(`Invalid file type. Allowed: ${accept}`);
      return;
    }

    setUploading(true);
    try {
      const response = await fileApi.upload(file, fileType);
      const uploadedFile = response.data;

      setCurrentFile({
        file_id: uploadedFile.file_id,
        file_type: uploadedFile.file_type,
        file_url: uploadedFile.file_url,
        meta_type: uploadedFile.meta_type,
      });
      onFileUploaded({
        file_id: uploadedFile.file_id,
        file_type: uploadedFile.file_type,
      });
      toast.success('File uploaded successfully');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      // Reset input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setCurrentFile(null);
    onFileUploaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!currentFile?.meta_type) return <FileText className="h-8 w-8 text-blue-600" />;
    if (currentFile.meta_type.startsWith('image')) {
      return <ImageIcon className="h-8 w-8 text-blue-600" />;
    }
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  return (
    <div className="space-y-2">
      {currentFile ? (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
          {currentFile.file_url && currentFile.meta_type?.startsWith('image') ? (
            <img
              src={currentFile.file_url}
              alt="Uploaded file"
              className="h-12 w-12 object-cover rounded"
            />
          ) : (
            getFileIcon()
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentFile.file_url ? currentFile.file_url.split('/').pop() : 'File uploaded'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              Type: {currentFile.meta_type || currentFile.file_type}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentFile.file_url && (
              <a
                href={currentFile.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View
              </a>
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept.replace(/,/g, ', ').replace(/\.\*/g, ' files')} (max {maxSizeMB}MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
