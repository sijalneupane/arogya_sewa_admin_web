import api from './axios';
import { API_ENDPOINTS } from './endpoints';

export interface FileUploadResponse {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export const fileApi = {
  // Upload a new file
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<FileUploadResponse>(API_ENDPOINTS.FILE_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update existing file
  update: (imageId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageId', imageId);
    
    return api.put<FileUploadResponse>(API_ENDPOINTS.FILE_UPDATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete file
  delete: (imageId: string) => 
    api.delete(API_ENDPOINTS.FILE_DELETE(imageId)),
};
