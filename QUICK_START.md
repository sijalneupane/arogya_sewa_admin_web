# Quick Start Guide - Hospital Form

## 🚀 Installation Complete!

The hospital creation/update form has been successfully implemented with all requested features.

## ✅ What's Included

### 1. **Three Image Upload Fields**
- Hospital Logo
- Hospital License
- Hospital Banner

Each with:
- Live preview
- Replace functionality
- Automatic upload/update API calls

### 2. **Interactive Map**
- Click to select location
- Manual latitude/longitude input
- Default: Kathmandu, Nepal

### 3. **Dynamic Contact Numbers**
- Add multiple contact numbers
- Remove numbers (minimum 1)

### 4. **Complete Validation**
- All required fields validated
- Email format checking
- Phone number validation
- Password strength (min 8 chars)

### 5. **Create & Update Modes**
- Single form for both operations
- Admin details only in create mode
- Automatic API detection

## 🎯 How to Use

### Create a New Hospital

1. Navigate to `/hospitals/create`
2. Upload three images (logo, license, banner)
3. Fill hospital details (name, location, date)
4. Click on map to select location
5. Add contact numbers
6. Fill admin details
7. Click "Create Hospital"

### Edit an Existing Hospital

1. Navigate to `/hospitals/:id/edit`
2. Form loads with existing data
3. Replace images if needed (updates existing)
4. Modify other fields
5. Click "Update Hospital"

## 📂 File Structure

```
src/
├── api/
│   ├── fileupload.api.ts       # NEW - File upload/update API
│   └── hospital.api.ts         # UPDATED - Hospital API
├── features/super-admin/hospitals/
│   ├── components/
│   │   ├── HospitalForm.tsx    # UPDATED - Main form
│   │   ├── ImageUpload.tsx     # NEW - Image upload component
│   │   └── MapSelector.tsx     # NEW - Map component
│   └── schemas/
│       └── hospital.schema.ts  # NEW - Validation schema
├── pages/SuperAdmin/
│   ├── CreateHospitalPage.tsx  # UPDATED - Create page
│   └── EditHospitalPage.tsx    # NEW - Edit page
└── types/
    └── hospital.type.ts        # UPDATED - Types
```

## 🔧 API Endpoints Required

Make sure your backend has these endpoints:

```
POST   /api/v1/fileupload          # Upload new file
PUT    /api/v1/fileupload          # Update file (with imageId)
POST   /api/v1/hospitals           # Create hospital
PUT    /api/v1/hospitals/:id       # Update hospital
GET    /api/v1/hospitals/:id       # Get hospital details
```

## 📝 JSON Structure

### Create Hospital Request
```json
{
  "name": "Hospital Name",
  "location": "Full Address",
  "latitude": 27.7172,
  "longitude": 85.324,
  "contact_number": ["9841234567", "9851234567"],
  "opened_date": "2023-10-15",
  "hospital_license_id": "uuid-from-file-upload",
  "logo_img_id": "uuid-from-file-upload",
  "banner_img_id": "uuid-from-file-upload",
  "admin_details": {
    "email": "admin@hospital.com",
    "name": "Admin Name",
    "phone_number": "9841234567",
    "password": "securepassword"
  }
}
```

### File Upload Response
```json
{
  "id": "uuid-string",
  "url": "https://...",
  "filename": "image.jpg",
  "mimetype": "image/jpeg",
  "size": 123456
}
```

## 🎨 Features Demo

### Image Upload Flow
```
1. User clicks "Click to upload"
2. Selects an image
3. ImageUpload calls POST /api/v1/fileupload
4. Gets back imageId
5. Stores in form field

On Replace:
1. User clicks "Replace" (on hover)
2. Selects new image
3. ImageUpload calls PUT /api/v1/fileupload with imageId
4. Gets back updated imageId
5. Updates form field
```

### Map Selection
```
1. Map shows default location (Kathmandu)
2. User clicks anywhere on map
3. Latitude and longitude auto-update
4. Or user can type coordinates manually
5. Map marker updates automatically
```

## 🔍 Testing Checklist

- [ ] Create a new hospital
- [ ] Upload all three images
- [ ] Select location on map
- [ ] Add multiple contact numbers
- [ ] Submit form
- [ ] Edit existing hospital
- [ ] Replace an image
- [ ] Update other fields
- [ ] Check validation errors
- [ ] Test with invalid data

## ⚠️ Important Notes

1. **Internet Required**: Map needs internet for tiles
2. **All Images Required**: Cannot submit without all 3 images
3. **At Least One Contact**: Must have minimum 1 contact number
4. **Admin in Create Only**: Admin fields only show when creating
5. **Automatic Upload**: Images upload immediately on selection

## 🐛 Common Issues

### Map Not Showing
- Check internet connection
- Verify leaflet CSS is imported
- Check browser console for errors

### Upload Fails
- Check backend CORS settings
- Verify file size limits
- Check network tab for error details

### Validation Errors
- Ensure all required fields filled
- Check email format
- Password must be 8+ characters
- Phone numbers must be 10-15 digits

## 📚 Documentation

For detailed documentation, see:
- [Hospital Form README](src/features/super-admin/hospitals/README.md)
- [Implementation Summary](HOSPITAL_FORM_IMPLEMENTATION.md)

## 🎉 You're All Set!

The form is ready to use. Just make sure your backend endpoints match the expected structure and you're good to go!

Need help? Check the component files - they have detailed comments explaining the functionality.
