# Hospital Form Component Architecture

## Component Hierarchy

```
CreateHospitalPage / EditHospitalPage
    │
    └── HospitalForm
            ├── ImageUpload (Logo)
            │   └── fileupload.api (upload/update)
            │
            ├── ImageUpload (License)
            │   └── fileupload.api (upload/update)
            │
            ├── ImageUpload (Banner)
            │   └── fileupload.api (upload/update)
            │
            ├── MapSelector
            │   └── React Leaflet (OpenStreetMap)
            │
            ├── Contact Numbers (Dynamic Array)
            │   └── useFieldArray
            │
            └── Admin Details (Create mode only)
```

## Data Flow

### Image Upload Flow
```
User Action           Component              API                Backend
─────────────────────────────────────────────────────────────────────
Select Image    →    ImageUpload      →    POST /fileupload    →   Save File
                                      ←    { id, url, ... }    ←
Store imageId   ←    onChange(id)     
                                      
Replace Image   →    ImageUpload      →    PUT /fileupload     →   Update File
                     (with imageId)        + imageId param     
                                      ←    { id, url, ... }    ←
Update imageId  ←    onChange(id)
```

### Hospital Creation Flow
```
User Action           Component              API                Backend
─────────────────────────────────────────────────────────────────────
Fill Form       →    HospitalForm     
Upload Images   →    ImageUpload      →    POST /fileupload    →   Save Files
Store imageIds  ←                     ←    { id, ... }
Click Map       →    MapSelector      
Set Coords      ←    onChange(lat,lng)
Submit Form     →    HospitalForm     →    POST /hospitals     →   Create Hospital
                                            + all data
Navigate        ←    onSuccess()      ←    { hospital }        ←
```

### Hospital Update Flow
```
User Action           Component              API                Backend
─────────────────────────────────────────────────────────────────────
Load Page       →    EditHospitalPage →    GET /hospitals/:id  →   Get Data
Populate Form   ←    HospitalForm     ←    { hospital }        ←
Modify Fields   →    Form Inputs
Replace Image   →    ImageUpload      →    PUT /fileupload     →   Update File
                     (with imageId)        + imageId param
Update imageId  ←    onChange(id)     ←    { id, ... }
Submit Form     →    HospitalForm     →    PUT /hospitals/:id  →   Update Hospital
Navigate        ←    onSuccess()      ←    { hospital }        ←
```

## Component Responsibilities

### HospitalForm
**Responsibilities:**
- Form state management (react-hook-form)
- Form validation (Zod schema)
- Submit handler (create/update)
- Conditional rendering (create vs edit mode)
- Error display

**Props:**
- `hospital?: Partial<CreateHospitalData> & { id?: string }` - Optional hospital data for edit mode
- `onSuccess?: () => void` - Callback after successful submission

**State:**
- Form values (controlled by react-hook-form)
- Submission status (via useMutation)

### ImageUpload
**Responsibilities:**
- File selection
- Image preview
- Upload/update API calls
- Loading/error states
- Replace/remove functionality

**Props:**
- `label: string` - Display label
- `value?: string` - Current imageId
- `onChange: (imageId: string) => void` - Callback with new imageId
- `error?: string` - Validation error message
- `accept?: string` - File type filter

**Internal State:**
- `preview: string` - Base64 preview URL
- `fileName: string` - Selected file name
- Upload mutation status

### MapSelector
**Responsibilities:**
- Display interactive map
- Handle click events
- Manual coordinate input
- Map marker positioning
- Map fly-to animation

**Props:**
- `latitude: number` - Current latitude
- `longitude: number` - Current longitude
- `onChange: (lat: number, lng: number) => void` - Callback with new coordinates
- `className?: string` - Additional CSS classes

**Internal State:**
- `position: [number, number]` - Current marker position

## API Layer

### fileupload.api.ts
```typescript
interface FileUploadResponse {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

upload(file: File): Promise<FileUploadResponse>
update(imageId: string, file: File): Promise<FileUploadResponse>
delete(imageId: string): Promise<void>
```

### hospital.api.ts
```typescript
getAll(): Promise<Hospital[]>
getById(id: string): Promise<Hospital>
create(data: CreateHospitalData): Promise<Hospital>
update(id: string, data: UpdateHospitalData): Promise<Hospital>
delete(id: string): Promise<void>
getStats(): Promise<HospitalStats>
```

## Validation Schema

### createHospitalSchema (Zod)
```typescript
{
  name: string (min 1)
  location: string (min 1)
  latitude: number (-90 to 90)
  longitude: number (-180 to 180)
  contact_number: string[] (min 1, each min 10 chars)
  opened_date: string
  hospital_license_id: string (min 1)
  logo_img_id: string (min 1)
  banner_img_id: string (min 1)
  admin_details: {
    email: email format
    name: string (min 1)
    phone_number: string (10-15 chars)
    password: string (min 8)
  }
}
```

## State Management

### Form State (react-hook-form)
- Handles all input values
- Validation errors
- Dirty/touched states
- Submit handler

### Upload State (TanStack Query)
- Per-image upload status
- Loading indicators
- Error handling
- Retry logic

### Navigation State
- onSuccess callback triggers navigation
- Invalidates query cache
- Redirects to hospital list

## Error Handling

### Validation Errors
- Displayed inline below each field
- Triggered on blur and submit
- Zod schema validation

### API Errors
- Upload failures shown in ImageUpload
- Submit failures shown at form bottom
- Automatic retry available

### Network Errors
- Map tiles fail gracefully
- Upload timeouts handled
- User-friendly messages

## Performance Considerations

### Image Upload
- Uploads triggered immediately on selection
- No need to wait for form submission
- Parallel uploads for all three images

### Form Validation
- Client-side validation with Zod
- Instant feedback on errors
- Prevents invalid submissions

### Map Loading
- Lazy loaded with React Leaflet
- Cached tiles from CDN
- Smooth animations

## Extensibility

### Adding New Image Types
1. Add new field to schema
2. Add ImageUpload component to form
3. Update CreateHospitalData type

### Adding New Form Fields
1. Update hospital.schema.ts
2. Update hospital.type.ts
3. Add input to HospitalForm.tsx

### Customizing Map
- Change default location in MapSelector
- Add search functionality
- Add custom markers
- Change tile provider

## Testing Strategy

### Unit Tests
- Validation schema tests
- API function tests
- Utility function tests

### Integration Tests
- Form submission flow
- Image upload flow
- Map interaction

### E2E Tests
- Complete hospital creation
- Hospital update flow
- Error scenarios
