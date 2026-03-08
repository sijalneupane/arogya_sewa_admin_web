import { SearchableSelect, SelectOption } from '@/components/ui/SearchableSelect';
import { DoctorStatus } from '@/types/doctor.type';

export const DOCTOR_STATUS_OPTIONS: SelectOption[] = [
  { value: DoctorStatus.ACTIVE, label: DoctorStatus.ACTIVE },
  { value: DoctorStatus.ON_LEAVE, label: DoctorStatus.ON_LEAVE },
  { value: DoctorStatus.ON_APPOINTMENT, label: DoctorStatus.ON_APPOINTMENT },
  { value: DoctorStatus.INACTIVE, label: DoctorStatus.INACTIVE },
];

interface StatusSelectProps {
  value: DoctorStatus | null;
  onChange: (value: DoctorStatus | null) => void;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export function StatusSelect({
  value,
  onChange,
  placeholder = 'Select status',
  disabled = false,
}: StatusSelectProps) {
  return (
    <SearchableSelect
      options={DOCTOR_STATUS_OPTIONS}
      value={value}
      onChange={(v) => onChange((v as DoctorStatus) || null)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
