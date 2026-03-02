# Hospital Form - Update Summary

## 🎯 Changes Made for Role-Based Access Control

### ✅ What Was Updated

#### 1. **Schema Separation** (`hospital.schema.ts`)

**Before**: Single schema for both create and update with admin_details always required

**After**: Two separate schemas
- `createHospitalSchema` - Includes required `admin_details` (Super Admin only)
- `updateHospitalSchema` - Excludes `admin_details` (partial update)

```typescript
// Create (with admin)
export const createHospitalSchema = baseHospitalSchema.extend({
  admin_details: z.object({ ... }),
});

// Update (without admin)
export const updateHospitalSchema = baseHospitalSchema.partial();
```

#### 2. **Form Component** (`HospitalForm.tsx`)

**New Features**:
- ✅ Role detection (Super Admin vs Hospital Admin)
- ✅ Dynamic schema selection based on create/edit mode
- ✅ Permission checks in submit handler
- ✅ Conditional admin_details section visibility
- ✅ Admin_details removed from update payload

**Key Changes**:
```typescript
// Role detection
const { user } = useAuthStore();
const isSuperAdmin = user?.role.role === 'SUPER_ADMIN';
const isHospitalAdmin = user?.role.role === 'HOSPITAL_ADMIN';

// Schema selection
resolver: zodResolver(isEditMode ? updateHospitalSchema : createHospitalSchema)

// Permission checks
if (isEditMode && isHospitalAdmin && hospital?.id !== user?.hospitalId) {
  alert('You can only update your own hospital');
  return;
}

if (!isEditMode && !isSuperAdmin) {
  alert('Only Super Admin can create hospitals');
  return;
}

// Admin details only for Super Admin in create mode
{!isEditMode && isSuperAdmin && (
  <div>Admin Details Section</div>
)}

// Remove admin_details from update
const { admin_details, ...updateData } = data as any;
return hospitalApi.update(hospital.id, updateData);
```

#### 3. **Create Hospital Page** (`CreateHospitalPage.tsx`)

**New Features**:
- ✅ Super Admin role check
- ✅ Auto-redirect to unauthorized if not Super Admin

```typescript
useEffect(() => {
  if (user?.role.role !== 'SUPER_ADMIN') {
    navigate('/unauthorized');
  }
}, [user, navigate]);
```

#### 4. **Edit Hospital Page** (`EditHospitalPage.tsx`)

**New Features**:
- ✅ Role-based access control
- ✅ Hospital ownership validation for Hospital Admin
- ✅ Conditional data fetching based on permissions

```typescript
// Hospital Admin can only edit their own hospital
useEffect(() => {
  if (isHospitalAdmin && user?.hospitalId !== id) {
    navigate('/unauthorized');
  }
  if (!isSuperAdmin && !isHospitalAdmin) {
    navigate('/unauthorized');
  }
}, [user, id, navigate, isSuperAdmin, isHospitalAdmin]);

// Only fetch if permitted
enabled: !!id && (isSuperAdmin || (isHospitalAdmin && user?.hospitalId === id))
```

## 🔒 Permission Rules Implemented

### Create Hospital
| Role | Access | Admin Details Required |
|------|--------|------------------------|
| Super Admin | ✅ Yes | ✅ Yes |
| Hospital Admin | ❌ No | N/A |
| Doctor | ❌ No | N/A |

### Update Hospital
| Role | Access | Conditions | Admin Details |
|------|--------|------------|---------------|
| Super Admin | ✅ Any Hospital | None | ❌ Not Included |
| Hospital Admin | ✅ Own Hospital Only | `hospital.id === user.hospitalId` | ❌ Not Included |
| Doctor | ❌ No Access | N/A | N/A |

## 📋 Form Field Differences

### Create Mode (Super Admin Only)
```typescript
Required Fields:
✅ Hospital name
✅ Location
✅ Latitude & Longitude (via map)
✅ Contact numbers (min 1)
✅ Opening date
✅ Three images (logo, license, banner)
✅ Admin Details:
   - Email
   - Name
   - Phone number
   - Password (min 8 chars)
```

### Update Mode (Super Admin or Hospital Admin)
```typescript
Optional Fields:
⚪ Hospital name
⚪ Location
⚪ Latitude & Longitude (via map)
⚪ Contact numbers
⚪ Opening date
⚪ Three images (can replace)
❌ Admin Details (NOT shown, NOT sent to backend)
```

## 🔄 Data Flow Changes

### Create Flow
```
Super Admin → Fill Form + Admin Details → Submit
  ↓
createHospitalSchema validation (requires admin_details)
  ↓
POST /api/v1/hospitals
  ↓
Backend creates: Hospital + Admin User Account
```

### Update Flow (Super Admin)
```
Super Admin → Load Hospital → Edit Form (no admin section) → Submit
  ↓
updateHospitalSchema validation (no admin_details)
  ↓
Remove admin_details from payload
  ↓
PUT /api/v1/hospitals/:id
  ↓
Backend updates: Hospital fields only
```

### Update Flow (Hospital Admin)
```
Hospital Admin → Check hospital.id === user.hospitalId
  ↓
If match → Load Hospital → Edit Form (no admin section) → Submit
  ↓
Check ownership again → updateHospitalSchema validation
  ↓
Remove admin_details from payload
  ↓
PUT /api/v1/hospitals/:id (own hospital only)
  ↓
Backend validates: User can only update their hospital
```

## 🛡️ Security Layers

### Layer 1: Page Level (UX)
- Route guards redirect unauthorized users
- Prevents UI from even loading

### Layer 2: Component Level (UX)
- Form checks role before submit
- Shows appropriate error messages

### Layer 3: API Level (Required Backend)
- JWT validation
- Role verification
- Hospital ownership check (for Hospital Admin)
- Reject admin_details in updates

## 🆕 New User Properties Used

From `auth.types.ts`:
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: Role;              // ← Used for permission checks
  hospitalId?: string;     // ← Used for Hospital Admin ownership
  ...
}

type UserRole = "SUPER_ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR";
```

## 📝 Migration Notes

### Frontend (Complete ✅)
- ✅ Schemas updated
- ✅ Form component updated
- ✅ Pages updated with guards
- ✅ Proper TypeScript types
- ✅ Error handling

### Backend (Required)
Your backend needs to:
1. ✅ Accept `admin_details` only in POST /hospitals
2. ✅ Ignore/reject `admin_details` in PUT /hospitals/:id
3. ✅ Validate role (SUPER_ADMIN for create)
4. ✅ Validate hospital ownership (HOSPITAL_ADMIN updates)
5. ✅ Create admin user account when creating hospital

## 🧪 Testing Scenarios

### Scenario 1: Super Admin Creates Hospital
1. Login as Super Admin
2. Navigate to /hospitals/create
3. See admin details fields ✅
4. Fill all fields including admin details
5. Submit form
6. Backend receives admin_details ✅
7. Hospital + admin user created

### Scenario 2: Super Admin Updates Any Hospital
1. Login as Super Admin
2. Navigate to /hospitals/:any-id/edit
3. Form loads successfully ✅
4. NO admin details section ❌
5. Modify fields
6. Submit form
7. Backend receives NO admin_details ✅
8. Hospital updated

### Scenario 3: Hospital Admin Updates Own Hospital
1. Login as Hospital Admin (hospitalId: "123")
2. Navigate to /hospitals/123/edit
3. Form loads successfully ✅
4. NO admin details section ❌
5. Modify fields
6. Submit form
7. Backend receives NO admin_details ✅
8. Hospital 123 updated

### Scenario 4: Hospital Admin Tries to Update Other Hospital
1. Login as Hospital Admin (hospitalId: "123")
2. Navigate to /hospitals/456/edit
3. Redirected to /unauthorized ✅
4. Cannot access form

### Scenario 5: Hospital Admin Tries to Create Hospital
1. Login as Hospital Admin
2. Navigate to /hospitals/create
3. Redirected to /unauthorized ✅
4. Cannot access form

### Scenario 6: Doctor Tries Hospital Operations
1. Login as Doctor
2. Navigate to /hospitals/create
3. Redirected to /unauthorized ✅
4. Navigate to /hospitals/:id/edit
5. Redirected to /unauthorized ✅

## ✨ Summary

### Before
- Single schema for create and update
- Admin details always required/shown
- No role-based access control
- Anyone could potentially create/edit hospitals

### After
- ✅ Separate schemas (create with admin, update without)
- ✅ Admin details only in create mode for Super Admin
- ✅ Role-based access control implemented
- ✅ Hospital Admin restricted to own hospital
- ✅ Super Admin full access
- ✅ Proper permission checks and redirects
- ✅ Clean separation of concerns

## 📚 Documentation

For more details, see:
- [PERMISSIONS.md](./PERMISSIONS.md) - Complete RBAC documentation
- [QUICK_START.md](./QUICK_START.md) - Usage guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture

---

**All changes are complete and tested!** ✅
