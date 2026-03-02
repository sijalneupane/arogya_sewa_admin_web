# Hospital Form - Role-Based Access Control (RBAC)

## 🔐 Permission Matrix

| Action | Super Admin | Hospital Admin | Doctor |
|--------|-------------|----------------|--------|
| Create Hospital | ✅ Yes | ❌ No | ❌ No |
| View All Hospitals | ✅ Yes | ❌ No | ❌ No |
| View Own Hospital | ✅ Yes | ✅ Yes | ❌ No |
| Update Any Hospital | ✅ Yes | ❌ No | ❌ No |
| Update Own Hospital | ✅ Yes | ✅ Yes | ❌ No |
| Delete Hospital | ✅ Yes | ❌ No | ❌ No |

## 👥 Role Definitions

### SUPER_ADMIN
- **Full Control**: Can create, read, update, and delete any hospital
- **Admin Management**: Can create hospital admin accounts
- **No Restrictions**: Access to all hospital data

### HOSPITAL_ADMIN
- **Own Hospital Only**: Can only view and update their assigned hospital
- **No Creation**: Cannot create new hospitals
- **No Admin Details**: Cannot modify admin credentials during updates
- **Restricted Access**: Only sees data for `user.hospitalId`

### DOCTOR
- **No Hospital Management**: Cannot access hospital management features
- **Read Only**: May view their own hospital's basic info (if implemented)

## 🛡️ Security Implementation

### 1. Create Hospital (Super Admin Only)

**Page**: `CreateHospitalPage.tsx`

```typescript
useEffect(() => {
  if (user?.role.role !== 'SUPER_ADMIN') {
    navigate('/unauthorized');
  }
}, [user, navigate]);
```

**Form**: `HospitalForm.tsx`
```typescript
if (!isEditMode && !isSuperAdmin) {
  alert('Only Super Admin can create hospitals');
  return;
}
```

**Required Fields for Creation**:
- All hospital details (name, location, coordinates, etc.)
- Three images (logo, license, banner)
- **Admin Details** (email, name, phone, password) ✅

### 2. Update Hospital

#### Super Admin
- Can update **any** hospital
- Can modify all fields **except** admin credentials
- No restrictions on which hospital

**Implementation**:
```typescript
// No restriction - can edit any hospital ID
const { data: response } = useQuery({
  queryKey: ['hospital', id],
  queryFn: () => hospitalApi.getById(id!),
  enabled: !!id && isSuperAdmin,
});
```

#### Hospital Admin
- Can **only** update their **own** hospital (`user.hospitalId === hospital.id`)
- Can modify all fields **except** admin credentials
- Blocked from accessing other hospitals

**Implementation**:
```typescript
// Check hospital ownership
useEffect(() => {
  if (isHospitalAdmin && user?.hospitalId !== id) {
    navigate('/unauthorized');
  }
}, [user, id, navigate, isHospitalAdmin]);

// Permission in form submit
if (isEditMode && isHospitalAdmin && hospital?.id !== user?.hospitalId) {
  alert('You can only update your own hospital');
  return;
}
```

**Fields Excluded from Updates**:
- ❌ `admin_details` (email, name, phone, password)
- ✅ All other hospital fields can be updated

## 📋 Form Behavior by Role & Mode

### Super Admin - Create Mode
```typescript
Schema: createHospitalSchema (includes admin_details)
Admin Details Section: ✅ Visible
Validation: All fields required including admin_details
API Call: POST /api/v1/hospitals
```

### Super Admin - Edit Mode
```typescript
Schema: updateHospitalSchema (excludes admin_details)
Admin Details Section: ❌ Hidden
Validation: All fields optional, no admin_details
API Call: PUT /api/v1/hospitals/:id
```

### Hospital Admin - Create Mode
```typescript
Access: ❌ Blocked at page level
Redirect: /unauthorized
```

### Hospital Admin - Edit Mode
```typescript
Schema: updateHospitalSchema (excludes admin_details)
Admin Details Section: ❌ Hidden
Hospital ID Check: ✅ Must match user.hospitalId
Validation: All fields optional, no admin_details
API Call: PUT /api/v1/hospitals/:id
```

## 🔍 Validation Schemas

### createHospitalSchema
Used for: **Creating new hospitals (Super Admin only)**

```typescript
{
  name: string (required),
  location: string (required),
  latitude: number (required),
  longitude: number (required),
  contact_number: string[] (required, min 1),
  opened_date: string (required),
  hospital_license_id: string (required),
  logo_img_id: string (required),
  banner_img_id: string (required),
  admin_details: {                    // ✅ REQUIRED
    email: string (email format),
    name: string (required),
    phone_number: string (10-15 chars),
    password: string (min 8 chars)
  }
}
```

### updateHospitalSchema
Used for: **Updating hospitals (Super Admin or Hospital Admin)**

```typescript
{
  name: string (optional),
  location: string (optional),
  latitude: number (optional),
  longitude: number (optional),
  contact_number: string[] (optional),
  opened_date: string (optional),
  hospital_license_id: string (optional),
  logo_img_id: string (optional),
  banner_img_id: string (optional)
  // ❌ admin_details NOT included
}
```

## 🚦 Access Control Flow

### Create Hospital Flow
```
1. User clicks "Create Hospital"
2. Check user.role.role === 'SUPER_ADMIN'
   ├─ Yes → Show form with admin_details
   └─ No  → Redirect to /unauthorized
3. User fills form including admin details
4. Submit validation (createHospitalSchema)
5. POST /api/v1/hospitals with admin_details
6. Backend creates hospital AND admin user
7. Success → Navigate to hospitals list
```

### Update Hospital Flow (Super Admin)
```
1. Super Admin clicks "Edit Hospital"
2. Load hospital data (any hospital ID)
3. Show form WITHOUT admin_details section
4. User modifies hospital fields
5. Submit validation (updateHospitalSchema)
6. Remove admin_details from payload
7. PUT /api/v1/hospitals/:id
8. Success → Navigate to hospitals list
```

### Update Hospital Flow (Hospital Admin)
```
1. Hospital Admin clicks "Edit Hospital"
2. Check hospital ID === user.hospitalId
   ├─ Match    → Load hospital data
   └─ No Match → Redirect to /unauthorized
3. Show form WITHOUT admin_details section
4. User modifies hospital fields
5. Submit validation (updateHospitalSchema)
6. Check hospital.id === user.hospitalId again
   ├─ Match    → Proceed
   └─ No Match → Alert and block
7. PUT /api/v1/hospitals/:id
8. Success → Navigate to hospitals list
```

## 🎯 Backend Expectations

The backend should enforce these rules:

### POST /api/v1/hospitals
- **Required Role**: SUPER_ADMIN
- **Required Fields**: All hospital fields + admin_details
- **Action**: Creates hospital AND admin user account
- **Returns**: Hospital object with ID

### PUT /api/v1/hospitals/:id
- **Allowed Roles**: 
  - SUPER_ADMIN (any hospital)
  - HOSPITAL_ADMIN (only their hospitalId)
- **Required Fields**: Any subset of hospital fields (partial update)
- **Excluded Fields**: admin_details (should be ignored if sent)
- **Action**: Updates hospital fields only
- **Returns**: Updated hospital object

### GET /api/v1/hospitals/:id
- **Allowed Roles**:
  - SUPER_ADMIN (any hospital)
  - HOSPITAL_ADMIN (only their hospitalId)
- **Returns**: Hospital object without admin credentials

## ⚠️ Security Considerations

### Frontend Checks (User Experience)
✅ Implemented in pages (redirects)  
✅ Implemented in form submit (alerts)  
✅ Schema validation based on mode  

### Backend Checks (Required!)
🔒 Verify JWT token and role  
🔒 Check hospital ownership for HOSPITAL_ADMIN  
🔒 Reject admin_details in update requests  
🔒 Rate limiting on create endpoint  
🔒 Audit logging for all operations  

## 📝 Error Messages

### Permission Denied
```typescript
// Non-super admin trying to create
"Only Super Admin can create hospitals"

// Hospital admin editing wrong hospital
"You can only update your own hospital"
```

### Page-Level Redirects
```typescript
// Unauthorized access
navigate('/unauthorized')
```

## 🧪 Testing Checklist

### Super Admin Tests
- [ ] Can access Create Hospital page
- [ ] Can see admin_details fields in create form
- [ ] Can create hospital with admin details
- [ ] Can access Edit Hospital for any hospital
- [ ] Cannot see admin_details in edit form
- [ ] Can update any hospital's details
- [ ] Updates don't send admin_details to backend

### Hospital Admin Tests
- [ ] Cannot access Create Hospital page (redirected)
- [ ] Can access Edit Hospital for own hospital
- [ ] Cannot access Edit Hospital for other hospitals (redirected)
- [ ] Cannot see admin_details in edit form
- [ ] Can update own hospital's details
- [ ] Cannot update other hospital's details (blocked)
- [ ] Updates don't send admin_details to backend

### Doctor Tests
- [ ] Cannot access Create Hospital page
- [ ] Cannot access Edit Hospital page
- [ ] Properly redirected to unauthorized

## 🔗 Related Files

- **Schema**: `src/features/super-admin/hospitals/schemas/hospital.schema.ts`
- **Form**: `src/features/super-admin/hospitals/components/HospitalForm.tsx`
- **Create Page**: `src/pages/SuperAdmin/CreateHospitalPage.tsx`
- **Edit Page**: `src/pages/SuperAdmin/EditHospitalPage.tsx`
- **Types**: `src/types/hospital.type.ts`
- **Auth Store**: `src/store/auth.store.ts`
