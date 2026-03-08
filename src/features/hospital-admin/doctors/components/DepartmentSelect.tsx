import { useDepartments } from '@/features/hospital-admin/departments/hooks/useDepartments';
import { SearchableSelect, SelectOption } from '@/components/ui/SearchableSelect';

interface DepartmentSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export function DepartmentSelect({
  value,
  onChange,
  placeholder = 'Select department',
  clearable = true,
  disabled = false,
}: DepartmentSelectProps) {
  const { departments, loading } = useDepartments();

  const options: SelectOption[] = departments.map((dept) => ({
    value: dept.department_id,
    label: dept.name,
  }));

  return (
    <SearchableSelect
      options={options}
      value={clearable ? value : (value || '')}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      loading={loading}
    />
  );
}
