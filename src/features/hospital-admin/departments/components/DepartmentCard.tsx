import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CardActionMenu } from '@/components/ui/CardActionMenu';
import { Department } from '@/types/department.type';

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardContent className="h-full flex flex-col ">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base text-gray-900 truncate flex-1">
            {department.name}
          </h3>
          <StatusBadge isActive={department.is_active} />
        </div>
        <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap wrap-break-word flex-1">
          {department.description}
        </p>
        <div className="border-t border-gray-100 pt-2.5 mt-auto">
          <CardActionMenu
            onEdit={() => onEdit(department)}
            onDelete={() => onDelete(department)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
