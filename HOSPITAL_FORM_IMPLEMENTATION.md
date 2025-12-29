# Hospital Form Implementation Summary

## 📋 What Was Created

A complete hospital creation and update form system with the following features:

### ✅ Components Created

1. **HospitalForm.tsx** - Main form component
   - Handles both create and update modes
   - Three image upload sections (Logo, License, Banner)
   - Interactive map for location selection
   - Dynamic contact number fields
   - Full validation with error messages

2. **ImageUpload.tsx** - Reusable image upload component
   - Preview uploaded images
   - Replace/remove functionality
   - Automatic API call detection (upload vs update)
   - Loading states and error handling

3. **MapSelector.tsx** - Interactive map component
   - OpenStreetMap integration
   - Click to select location
   - Manual latitude/longitude input
   - Default location: Kathmandu, Nepal

### ✅ API Integration

1. **fileupload.api.ts** - File upload API
   - `upload(file)` - Upload new files
   - `update(imageId, file)` - Update existing files
   - `delete(imageId)` - Delete files

2. **hospital.api.ts** - Updated with new types
   - Supports new hospital data structure

### ✅ Type Definitions

Updated `hospital.type.ts` with:
- New hospital structure matching backend requirements
- `CreateHospitalData` interface
- `UpdateHospitalData` interface

### ✅ Validation Schema

Created `hospital.schema.ts` with Zod validation for:
- All required fields
- Email validation
- Phone number validation
- Password minimum length
- Coordinate ranges
- Array validation for contact numbers

### ✅ Pages

1. **CreateHospitalPage.tsx** - Updated to use new form
2. **EditHospitalPage.tsx** - Created for editing hospitals

## 🎯 How It Works

### Image Upload Flow

```
First Upload:
User selects image → Upload to /api/v1/fileupload → Get imageId → Store in form

Replace Image:
User selects new image → Update via /api/v1/fileupload with imageId → Get new imageId
```

### Hospital Creation Flow

```
1. Fill all form fields
2. Upload 3 images (logo, license, banner) - get IDs
3. Select location on map - get coordinates
4. Add contact numbers
5. Fill admin details
6. Submit → POST to /api/v1/hospitals
```

### Hospital Update Flow

```
1. Load hospital data
2. Form populates with existing data
3. User can replace images (calls update API)
4. User can modify other fields
5. Admin details section is hidden
6. Submit → PUT to /api/v1/hospitals/:id
```

## 📦 Dependencies Added

```bash
pnpm add leaflet react-leaflet @types/leaflet
```

## 🔧 Files Modified

1. `src/api/hospital.api.ts` - Updated types
2. `src/types/hospital.type.ts` - New structure
3. `src/pages/SuperAdmin/CreateHospitalPage.tsx` - Simplified
4. `src/index.css` - Added Leaflet CSS import

## 🚀 Usage Example

### Create Hospital
```tsx
import HospitalForm from '@/features/super-admin/hospitals/components/HospitalForm';

<HospitalForm onSuccess={() => navigate('/hospitals')} />
```

### Edit Hospital
```tsx
import HospitalForm from '@/features/super-admin/hospitals/components/HospitalForm';

<HospitalForm 
  hospital={hospitalData} 
  onSuccess={() => navigate('/hospitals')} 
/>
```

## 📝 Expected JSON Structure

### Request (Create)
```json
{
  "name": "Hospital Name",
  "location": "Address",
  "latitude": 27.7172,
  "longitude": 85.324,
  "contact_number": ["9841234567", "9851234567"],
  "opened_date": "2023-10-15",
  "hospital_license_id": "image-uuid-1",
  "logo_img_id": "image-uuid-2",
  "banner_img_id": "image-uuid-3",
  "admin_details": {
    "email": "admin@hospital.com",
    "name": "Admin Name",
    "phone_number": "9841234567",
    "password": "password123"
  }
}
```

### Request (Update)
```json
{
  "name": "Updated Name",
  "location": "Updated Address",
  "latitude": 27.7172,
  "longitude": 85.324,
  "contact_number": ["9841234567"],
  "opened_date": "2023-10-15",
  "hospital_license_id": "image-uuid-1",
  "logo_img_id": "new-image-uuid",
  "banner_img_id": "image-uuid-3"
}
```

## 🎨 Features Highlights

- ✅ Three separate image upload fields with preview
- ✅ Interactive map with click-to-select location
- ✅ Manual latitude/longitude input
- ✅ Dynamic contact number fields (add/remove)
- ✅ Date picker for opening date
- ✅ Complete form validation
- ✅ Loading states during upload/submit
- ✅ Error handling and display
- ✅ Responsive design
- ✅ Reusable for both create and update

## 🔐 Backend Requirements

Make sure your backend supports:

1. **POST /api/v1/fileupload** - Upload new file
2. **PUT /api/v1/fileupload** - Update existing file with imageId
3. **POST /api/v1/hospitals** - Create hospital
4. **PUT /api/v1/hospitals/:id** - Update hospital
5. **GET /api/v1/hospitals/:id** - Get hospital details

## 📱 Map Integration

- Uses OpenStreetMap (free, no API key required)
- Default location: Kathmandu, Nepal (27.7172, 85.324)
- Click on map to select location
- Manual input for precise coordinates
- Responsive and mobile-friendly

## ⚠️ Important Notes

1. Admin details section only shows in create mode
2. Images are uploaded immediately on selection
3. Form validates all fields before submission
4. Contact numbers require at least one entry
5. All three images are required
6. Map requires internet connection

## 🐛 Troubleshooting

### Map not showing
- Check internet connection
- Verify Leaflet CSS is imported in index.css
- Check console for errors

### Image upload fails
- Verify backend endpoint is correct
- Check file size limits
- Ensure CORS is configured

### Form validation errors
- Check all required fields are filled
- Verify email format
- Ensure password is at least 8 characters
- Check coordinate ranges (-90 to 90 for lat, -180 to 180 for lng)

## 📚 Documentation

For detailed usage instructions, see:
- [Hospital Form README](./README.md)
- Component-level documentation in each file
