import api from './axios';
import { API_ENDPOINTS } from './endpoints';

export enum FileTypeEnum {
  PROFILE = 'profile',
  LICENSE = 'license',
  HOSPITAL_LOGO = 'hospital_logo',
  HOSPITAL = 'hospital',
  HOSPITAL_BANNER = 'hospital_banner',
  MEDICAL_REPORT = 'medical_report',
  PRESCRIPTION = 'prescription',
  OTHER = 'other',
}

export interface FileUploadResponse {
  file_id: string;
  file_url: string;
  hospital_id: string | null;
  user_id: string;
  public_id: string;
  meta_type: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}

export const fileApi = {
  // Upload a new file
  upload: (file: File, fileType: FileTypeEnum = FileTypeEnum.OTHER) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    
    return api.post<FileUploadResponse>(API_ENDPOINTS.FILE_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update existing file
  update: (imageId: string, file: File, fileType: FileTypeEnum = FileTypeEnum.OTHER) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageId', imageId);
    formData.append('file_type', fileType);
    
    return api.patch<FileUploadResponse>(API_ENDPOINTS.FILE_UPDATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete file
  delete: (imageId: string) => 
    api.delete(API_ENDPOINTS.FILE_DELETE(imageId)),
};
