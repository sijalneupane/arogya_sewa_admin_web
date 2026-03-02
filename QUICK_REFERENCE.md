# Hospital Form - Quick Reference

## 🎯 Role-Based Permissions

```
┌─────────────────┬──────────────┬────────────────┬─────────┐
│ Action          │ Super Admin  │ Hospital Admin │ Doctor  │
├─────────────────┼──────────────┼────────────────┼─────────┤
│ Create Hospital │ ✅ Yes       │ ❌ No          │ ❌ No   │
│ Edit Any        │ ✅ Yes       │ ❌ No          │ ❌ No   │
│ Edit Own        │ ✅ Yes       │ ✅ Yes         │ ❌ No   │
└─────────────────┴──────────────┴────────────────┴─────────┘
```

## 📋 Form Fields by Mode

### CREATE (Super Admin Only)
```typescript
✅ Hospital name
✅ Location
✅ Latitude/Longitude (map)
✅ Contact numbers (array)
✅ Opening date
✅ Logo image
✅ License image  
✅ Banner image
✅ Admin email      ← REQUIRED
✅ Admin name       ← REQUIRED
✅ Admin phone      ← REQUIRED
✅ Admin password   ← REQUIRED
```

### UPDATE (Super Admin or Hospital Admin)
```typescript
⚪ Hospital name
⚪ Location
⚪ Latitude/Longitude (map)
⚪ Contact numbers (array)
⚪ Opening date
⚪ Logo image
⚪ License image
⚪ Banner image
❌ Admin details   ← NOT SHOWN, NOT SENT
```

## 🔑 Key Implementation Details

### Schema Selection
```typescript
// Form automatically picks correct schema
isEditMode ? updateHospitalSchema : createHospitalSchema
```

### Permission Checks
```typescript
// Page level (redirects)
if (user?.role.role !== 'SUPER_ADMIN') {
  navigate('/unauthorized');
}

// Hospital Admin ownership
if (isHospitalAdmin && user?.hospitalId !== id) {
  navigate('/unauthorized');
}

// Form level (alerts)
if (!isSuperAdmin && !isEditMode) {
  alert('Only Super Admin can create hospitals');
}
```

### Data Submission
```typescript
// CREATE: Includes admin_details
POST /api/v1/hospitals
{
  ...hospitalFields,
  admin_details: { email, name, phone, password }
}

// UPDATE: Excludes admin_details
PUT /api/v1/hospitals/:id
{
  ...hospitalFields
  // admin_details removed before sending
}
```

## 🚀 Quick Usage

### Super Admin Creates Hospital
```typescript
// Navigate to create page
<Link to="/hospitals/create">Create Hospital</Link>

// Form shows with admin section
<HospitalForm onSuccess={() => navigate('/hospitals')} />

// Submits with admin_details
```

### Super Admin Edits Any Hospital
```typescript
// Navigate to edit page
<Link to={`/hospitals/${hospitalId}/edit`}>Edit</Link>

// Form shows without admin section
<HospitalForm 
  hospital={hospitalData} 
  onSuccess={() => navigate('/hospitals')} 
/>

// Submits without admin_details
```

### Hospital Admin Edits Own Hospital
```typescript
// Navigate to edit (only works if ID matches user.hospitalId)
<Link to={`/hospitals/${user.hospitalId}/edit`}>Edit My Hospital</Link>

// Permission check passes
<HospitalForm 
  hospital={hospitalData} 
  onSuccess={() => navigate('/hospitals')} 
/>

// Submits without admin_details
```

## 🔒 Backend Requirements

Your backend MUST:

1. **Create Endpoint**
   ```typescript
   POST /api/v1/hospitals
   Auth: Super Admin only
   Body: CreateHospitalData (with admin_details)
   Action: Create hospital + admin user
   ```

2. **Update Endpoint**
   ```typescript
   PUT /api/v1/hospitals/:id
   Auth: Super Admin (any) | Hospital Admin (own only)
   Body: UpdateHospitalData (without admin_details)
   Action: Update hospital fields only
   Validation: 
     - If Hospital Admin: req.user.hospitalId === req.params.id
   ```

3. **Get Endpoint**
   ```typescript
   GET /api/v1/hospitals/:id
   Auth: Super Admin (any) | Hospital Admin (own only)
   Validation:
     - If Hospital Admin: req.user.hospitalId === req.params.id
   ```

## ⚠️ Important Notes

1. **Admin Details**: Only shown and required when Super Admin creates a new hospital
2. **Hospital Ownership**: Hospital Admin can only access their `user.hospitalId`
3. **Update Payload**: Never includes `admin_details` - stripped before API call
4. **Redirects**: Unauthorized users redirected to `/unauthorized` page
5. **Image Upload**: Works same for both create and update modes

## 📁 File Locations

```
src/
├── features/super-admin/hospitals/
│   ├── components/
│   │   └── HospitalForm.tsx        ← Main form component
│   └── schemas/
│       └── hospital.schema.ts      ← Validation schemas
├── pages/SuperAdmin/
│   ├── CreateHospitalPage.tsx      ← Super Admin only
│   └── EditHospitalPage.tsx        ← Role-based access
└── store/
    └── auth.store.ts               ← User role info
```

## 🧪 Test Checklist

- [ ] Super Admin can create hospital with admin details
- [ ] Super Admin can edit any hospital without admin section
- [ ] Hospital Admin can edit own hospital without admin section
- [ ] Hospital Admin cannot create hospitals (redirected)
- [ ] Hospital Admin cannot edit other hospitals (redirected)
- [ ] Update requests don't include admin_details
- [ ] Create requests include admin_details
- [ ] All images upload correctly in both modes
- [ ] Map works in both modes
- [ ] Contact numbers can be added/removed

---

**Need detailed docs?** See [PERMISSIONS.md](./PERMISSIONS.md) or [RBAC_UPDATE_SUMMARY.md](./RBAC_UPDATE_SUMMARY.md)
