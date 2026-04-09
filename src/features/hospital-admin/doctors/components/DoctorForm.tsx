import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CreateDoctorData,
  UpdateDoctorData,
  DoctorStatus,
} from "@/types/doctor.type";
import { doctorApi } from "@/api/doctor.api";
import { Button } from "@/components/ui/button";
import { DepartmentSelect } from "@/features/hospital-admin/doctors/components/DepartmentSelect";
import { StatusSelect } from "@/features/hospital-admin/doctors/components/StatusSelect";
import ImageUpload from "@/components/ui/ImageUpload";
import { FileUpload, UploadedFile } from "@/components/ui/FileUpload";
import { FileTypeEnum } from "@/api/fileupload.api";
import { Eye, EyeOff } from "lucide-react";

interface DoctorFormProps {
  doctor?: {
    id?: string;
    experience: string;
    fee?: number | null;
    bio?: string | null;
    department_id?: string | null;
    status?: DoctorStatus;
    license_certificate_id?: string | null;
    license_certificate?: UploadedFile | null;
    user: {
      id?: string; // Add user ID
      name: string;
      email: string;
      phone_number: string;
      profile_image_id?: string | null;
      profile_image_url?: string | null;
    };
  };
  onSuccess?: () => void;
}

export function DoctorForm({ doctor, onSuccess }: DoctorFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!doctor?.id;
  const [licenseFile, setLicenseFile] = useState<UploadedFile | null>(
    doctor?.license_certificate || null,
  );
  const [profileImageId, setProfileImageId] = useState<string>(
    doctor?.user?.profile_image_id || "",
  );
  const profileImageUrl = doctor?.user?.profile_image_url || "";
  const doctorUserId = doctor?.user?.id;
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<CreateDoctorData | UpdateDoctorData>({
    mode: "onChange",
    defaultValues: {
      experience: doctor?.experience || "",
      fee: doctor?.fee ?? null,
      bio: doctor?.bio || "",
      department_id: doctor?.department_id || null,
      status: doctor?.status || undefined,
      license_certificate_id: doctor?.license_certificate_id || null,
      user: {
        name: doctor?.user?.name || "",
        email: doctor?.user?.email || "",
        phone_number: doctor?.user?.phone_number || "",
        password: "",
        profile_image_id: doctor?.user?.profile_image_id || null,
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateDoctorData | UpdateDoctorData) => {
      if (isEditMode && doctor?.id) {
        return doctorApi.update(doctor.id, data as UpdateDoctorData);
      }
      return doctorApi.create(data as CreateDoctorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors-hospital-my"] });
      toast.success(
        isEditMode
          ? "Doctor updated successfully!"
          : "Doctor created successfully!",
      );
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        (isEditMode ? "Failed to update doctor" : "Failed to create doctor");
      toast.error(errorMessage);
    },
  });

  const handleLicenseUpload = (
    fileData: { file_id: string; file_type: string } | null,
  ) => {
    setLicenseFile(fileData ? { ...fileData, file_url: "" } : null);
  };

  const handleProfileImageChange = (imageId: string) => {
    setProfileImageId(imageId);
  };

  const handleFormSubmit = (data: CreateDoctorData | UpdateDoctorData) => {
    const submitData: any = {
      ...data,
      license_certificate_id: licenseFile?.file_id || null,
      user: {
        ...data.user,
        profile_image_id: profileImageId || null,
      },
    };

    // In edit mode, if password is empty, don't include it in the submission
    // The backend will keep the existing password if the field is not sent
    if (isEditMode && !data.user.password) {
      const { password, ...userWithoutPassword } = submitData.user;
      submitData.user = userWithoutPassword;
    }

    mutation.mutate(submitData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
      noValidate
    >
      {/* User Credentials Section - Show for both create and edit modes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          User Credentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Profile Image Upload */}
          <div className="md:justify-self-center justify-self-start">
            <label className="block text-sm font-medium mb-1 md:text-center md:mb-2">
              Profile Image <span className="text-red-500">*</span>
            </label>
            <Controller
              name="user.profile_image_id"
              control={control}
              rules={{
                required: "Profile image is required",
                validate: (value) => !!value || "Profile image is required",
              }}
              render={({ field }) => (
                <ImageUpload
                  label=""
                  value={profileImageId}
                  fileType={FileTypeEnum.OTHER}
                  onChange={(id) => {
                    field.onChange(id);
                    handleProfileImageChange(id);
                    if (id) {
                      clearErrors("user.profile_image_id");
                    }
                  }}
                  className="mb-3"
                  initialImageUrl={profileImageUrl || undefined}
                  targetUserId={doctorUserId}
                />
              )}
            />
            {errors.user && "profile_image_id" in errors.user && (
              <p className="text-red-500 text-xs mt-1">
                {errors.user.profile_image_id?.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-10 md:place-content-center-safe">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("user.name", {
                  required: "Full name is required",
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.user && "name" in errors.user ? "border-red-500" : "border-gray-300"}`}
                placeholder="Dr. John Smith"
              />
              {errors.user && "name" in errors.user && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user.name?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("user.email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message:
                      "Email must include @ and a valid domain (e.g., user@example.com)",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.user && "email" in errors.user ? "border-red-500" : "border-gray-300"}`}
                placeholder="doctor@hospital.com"
              />
              {errors.user && "email" in errors.user && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user.email?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("user.phone_number", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message:
                      "Please enter a valid 10-digit phone number (digits only)",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.user?.phone_number
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="9841000000"
              />
              {errors.user && "phone_number" in errors.user && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user.phone_number?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("user.password", {
                    required: !isEditMode ? "Password is required" : false,
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.user && "password" in errors.user ? "border-red-500" : "border-gray-300"}`}
                  placeholder={
                    isEditMode
                      ? "•••••••• (leave blank to keep current)"
                      : "••••••••"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.user && "password" in errors.user && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user.password?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Information Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Doctor Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("experience", {
                required: "Experience is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.experience ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g. 5 years, 6 months"
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fee (NPR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              {...register("fee", {
                required: "Fee is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Fee must be 0 or more",
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fee ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g. 500"
            />
            {errors.fee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fee.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              rules={{
                required: "Status is required",
                validate: (value) => !!value || "Status is required",
              }}
              render={({ field }) => (
                <StatusSelect
                  value={field.value || null}
                  onChange={(value) => {
                    field.onChange(value || undefined);
                    if (value) {
                      clearErrors("status");
                    }
                  }}
                  placeholder="Select status"
                  hasError={!!errors.status}
                />
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <Controller
              name="department_id"
              control={control}
              rules={{
                required: "Department is required",
                validate: (value) => !!value || "Department is required",
              }}
              render={({ field }) => (
                <DepartmentSelect
                  value={field.value || null}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value) {
                      clearErrors("department_id");
                    }
                  }}
                  placeholder="Select department"
                  clearable
                  hasError={!!errors.department_id}
                />
              )}
            />
            {errors.department_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.department_id.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            {...register("bio")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write a brief bio about the doctor..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            License Certificate <span className="text-red-500">*</span>
          </label>
          <Controller
            name="license_certificate_id"
            control={control}
            rules={{
              required: "License certificate is required",
              validate: (value) => !!value || "License certificate is required",
            }}
            render={({ field }) => (
              <FileUpload
                onFileUploaded={(fileData) => {
                  const fileId = fileData?.file_id || null;
                  field.onChange(fileId);
                  handleLicenseUpload(fileData);
                }}
                fileType={FileTypeEnum.LICENSE}
                initialFile={licenseFile}
              />
            )}
          />
          {errors.license_certificate_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.license_certificate_id.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Upload the doctor&apos;s medical license certificate (PDF or Image,
            max 5MB)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Update Doctor"
              : "Create Doctor"}
        </Button>
      </div>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to {isEditMode ? "update" : "create"} doctor. Please try again.
        </div>
      )}
    </form>
  );
}
