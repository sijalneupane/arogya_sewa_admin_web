import { Hospital } from '@/types/hospital.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Calendar, User, Mail, Building2, FileText, Image as ImageIcon } from 'lucide-react';
import MapDisplay from './MapDisplay';
import { ImagePreview } from '@/components/ui/ImagePreview';

interface HospitalDetailViewProps {
  hospital: Hospital;
}

export default function HospitalDetailView({ hospital }: HospitalDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Banner Section */}
      {hospital.banner?.file_url && (
        <ImagePreview src={hospital.banner.file_url} alt={`${hospital.name} banner`} title="Hospital Banner">
          <div className="w-full h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src={hospital.banner.file_url}
              alt={`${hospital.name} banner`}
              className="w-full h-full object-cover"
            />
          </div>
        </ImagePreview>
      )}

      {/* Hospital Header */}
      <div className="flex items-start gap-6">
        {hospital.logo?.file_url ? (
          <img
            src={hospital.logo.file_url}
            alt={hospital.name}
            className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200"
          />
        ) : (
          <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{hospital.name}</h1>
          <p className="text-gray-600 mt-1 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {hospital.location}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Hospital ID: {hospital.hospital_id}
          </p>
        </div>
      </div>

      {/* Hospital Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Hospital Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Numbers</label>
              <div className="mt-1 space-y-1">
                {hospital.contact_number.map((number, index) => (
                  <p key={index} className="flex items-center gap-2 text-gray-900">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {number}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Opened Date</label>
              <p className="flex items-center gap-2 text-gray-900 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                {new Date(hospital.opened_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Registration</label>
              <div className="mt-1 text-gray-900 text-sm">
                <p>Created: {new Date(hospital.created_at).toLocaleString()}</p>
                <p>Last Updated: {new Date(hospital.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Hospital Administrator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hospital.admin ? (
              <>
                <div className="flex items-center gap-4">
                  {hospital.admin.profile_img?.file_url ? (
                    <img
                      src={hospital.admin.profile_img.file_url}
                      alt={hospital.admin.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{hospital.admin.name}</h3>
                    <p className="text-sm text-gray-600">{hospital.admin.role.description}</p>
                    <p className={`text-xs mt-1 ${hospital.admin.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {hospital.admin.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="flex items-center gap-2 text-gray-900 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {hospital.admin.email}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="flex items-center gap-2 text-gray-900 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {hospital.admin.phone_number}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Admin ID</label>
                  <p className="text-gray-900 mt-1">{hospital.admin.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Account Created</label>
                  <p className="text-gray-900 text-sm mt-1">
                    {new Date(hospital.admin.created_at).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No admin information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Location Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Hospital Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapDisplay
            latitude={hospital.latitude}
            longitude={hospital.longitude}
            hospitalName={hospital.name}
            location={hospital.location}
          />
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-xs font-medium text-gray-600">Latitude</label>
              <p className="text-gray-900">{hospital.latitude}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Longitude</label>
              <p className="text-gray-900">{hospital.longitude}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* License */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Hospital License
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospital.license?.file_url ? (
              <ImagePreview src={hospital.license.file_url} alt="Hospital License" title="Hospital License">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <img
                    src={hospital.license.file_url}
                    alt="Hospital License"
                    className="w-full h-48 object-contain bg-gray-50"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center">
                    <span className="opacity-0 hover:opacity-100 transition-opacity bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      Click to view
                    </span>
                  </div>
                </div>
              </ImagePreview>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No license document available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hospital Logo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospital.logo?.file_url ? (
              <ImagePreview src={hospital.logo.file_url} alt="Hospital Logo" title="Hospital Logo">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <img
                    src={hospital.logo.file_url}
                    alt="Hospital Logo"
                    className="w-full h-48 object-contain bg-gray-50"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center">
                    <span className="opacity-0 hover:opacity-100 transition-opacity bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      Click to view
                    </span>
                  </div>
                </div>
              </ImagePreview>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No logo available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}