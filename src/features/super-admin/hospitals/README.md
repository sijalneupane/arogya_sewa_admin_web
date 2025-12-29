# Hospital Form Component

A comprehensive hospital creation and update form with image upload, map selection, and dynamic contact number management.

## Features

- **Three Image Uploads**: Logo, License, and Banner with preview and update functionality
- **Interactive Map**: Select hospital location by clicking on the map
- **Multiple Contact Numbers**: Add/remove contact numbers dynamically
- **Create & Update Modes**: Single form component for both operations
- **Form Validation**: Zod schema validation with error messages
- **Automatic API Handling**: Differentiates between upload and update based on imageId

## File Structure

```
src/features/super-admin/hospitals/
├── components/
│   ├── HospitalForm.tsx      # Main form component
│   ├── ImageUpload.tsx       # Reusable image upload component
│   └── MapSelector.tsx       # Interactive map for location selection
├── schemas/
│   └── hospital.schema.ts    # Zod validation schemas
src/api/
├── fileupload.api.ts         # File upload/update API functions
└── hospital.api.ts           # Hospital CRUD operations
src/types/
└── hospital.type.ts          # TypeScript interfaces
```

## Usage

### Creating a New Hospital

```tsx
import HospitalForm from '@/features/super-admin/hospitals/components/HospitalForm';

function CreateHospitalPage() {
  const handleSuccess = () => {
    // Navigate back or show success message
    console.log('Hospital created successfully!');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Hospital</h1>
      <HospitalForm onSuccess={handleSuccess} />
    </div>
  );
}
```

### Updating an Existing Hospital

```tsx
import HospitalForm from '@/features/super-admin/hospitals/components/HospitalForm';

function EditHospitalPage() {
  const { data: hospital } = useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: () => hospitalApi.getById(hospitalId),
  });

  const handleSuccess = () => {
    console.log('Hospital updated successfully!');
  };

  if (!hospital) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Hospital</h1>
      <HospitalForm hospital={hospital} onSuccess={handleSuccess} />
    </div>
  );
}
```

## API Endpoints

### File Upload
- **Endpoint**: `/api/v1/fileupload`
- **Method**: POST
- **Body**: FormData with file
- **Response**: `{ id, url, filename, mimetype, size }`

### File Update
- **Endpoint**: `/api/v1/fileupload`
- **Method**: PUT
- **Body**: FormData with file and imageId
- **Response**: `{ id, url, filename, mimetype, size }`

### Create Hospital
- **Endpoint**: `/api/v1/hospitals`
- **Method**: POST
- **Body**:
```json
{
  "name": "string",
  "location": "string",
  "latitude": 0,
  "longitude": 0,
  "contact_number": ["string"],
  "opened_date": "2023-10-15",
  "hospital_license_id": "string",
  "logo_img_id": "string",
  "banner_img_id": "string",
  "admin_details": {
    "email": "user@example.com",
    "name": "string",
    "phone_number": "string",
    "password": "string"
  }
}
```

### Update Hospital
- **Endpoint**: `/api/v1/hospitals/:id`
- **Method**: PUT
- **Body**: Partial hospital data (same structure as create)

## Component Props

### HospitalForm

| Prop | Type | Description |
|------|------|-------------|
| hospital | `CreateHospitalData & { id?: string }` | Optional. Hospital data for edit mode |
| onSuccess | `() => void` | Optional. Callback after successful create/update |

### ImageUpload

| Prop | Type | Description |
|------|------|-------------|
| label | `string` | Label text for the upload field |
| value | `string` | Image ID |
| onChange | `(imageId: string) => void` | Callback with new image ID |
| error | `string` | Error message to display |
| accept | `string` | File type filter (default: 'image/*') |

### MapSelector

| Prop | Type | Description |
|------|------|-------------|
| latitude | `number` | Initial latitude |
| longitude | `number` | Initial longitude |
| onChange | `(lat: number, lng: number) => void` | Callback with new coordinates |

## Image Upload Flow

1. **First Upload**: User selects an image → Calls `/api/v1/fileupload` → Receives `imageId` → Stores in form
2. **Replace Image**: User selects new image → Calls `/api/v1/fileupload` with `imageId` → Updates image → Receives updated `imageId`

The ImageUpload component automatically determines whether to call upload or update based on the presence of an `imageId`.

## Form Validation

All fields are validated using Zod schema:

- **Hospital Name**: Required
- **Location**: Required
- **Latitude**: -90 to 90
- **Longitude**: -180 to 180
- **Contact Numbers**: Array with at least one valid phone number
- **Opened Date**: Required
- **All Images**: Required
- **Admin Details**: Email, name, phone (10-15 chars), password (min 8 chars)

## Map Features

- Click anywhere on the map to select location
- Default center: Kathmandu, Nepal (27.7172, 85.324)
- Manual input for precise latitude/longitude
- Auto-updates when coordinates change

## Dependencies

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "@types/leaflet": "^1.9.21",
  "react-hook-form": "^7.68.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.1.13"
}
```

## Notes

- The form automatically hides admin details fields in edit mode
- Contact numbers can be dynamically added/removed (minimum 1)
- All images show preview after upload
- Map requires internet connection for tiles
- Form uses TanStack Query for API mutations
