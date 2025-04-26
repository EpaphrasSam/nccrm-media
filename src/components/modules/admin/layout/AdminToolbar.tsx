import { ReactNode } from "react";
import { Button } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import { SearchInput } from "@/components/common/inputs/SearchInput";
import { buttonStyles } from "@/lib/styles";
import { usePermissions } from "@/hooks/usePermissions";
import type { RolePermissions } from "@/services/roles/types";

type PermissionModule = keyof RolePermissions;

export interface AdminToolbarProps {
  searchPlaceholder: string;
  onSearch: (query: string) => void;
  addButtonLabel: string;
  onAdd: () => void;
  filterComponent?: ReactNode;
  addPermissionModule?: PermissionModule;
}

export function AdminToolbar({
  searchPlaceholder,
  onSearch,
  addButtonLabel,
  onAdd,
  filterComponent,
  addPermissionModule,
}: AdminToolbarProps) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const canAdd = addPermissionModule
    ? hasPermission(addPermissionModule, "add")
    : true;

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      {/* Search and Filters Row */}
      <div className="flex flex-wrap gap-4">
        <SearchInput
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          className="flex-1 w-full md:w-[300px]"
        />
        {filterComponent}
      </div>

      {/* Add Button Row - Conditionally Rendered */}
      {canAdd && !permissionsLoading && (
        <div className="flex justify-end">
          <Button
            color="primary"
            variant="bordered"
            startContent={<FiPlus className="h-6 w-6" />}
            onPress={onAdd}
            className={`bg-brand-red-dark text-white px-8 ${buttonStyles}`}
          >
            {addButtonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
