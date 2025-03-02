"use client";

import { useState } from "react";
import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Skeleton,
} from "@heroui/react";
import { FiFilter } from "react-icons/fi";
import { useUsersStore } from "@/store/users";
import { buttonStyles } from "@/lib/styles";
import { AdminToolbar } from "../layout/AdminToolbar";
import useSWR from "swr";
import type { Department } from "@/services/departments/types";
import type { Role } from "@/services/roles/types";

interface FilterState {
  department: string;
  role: string;
}

export function UsersToolbar() {
  const {
    setSearchQuery,
    setFilters,
    resetFilters,
    addUser,
    isFiltersLoading,
  } = useUsersStore();

  const [tempFilters, setTempFilters] = useState<FilterState>({
    department: "all",
    role: "all",
  });

  // Get filter options from SWR cache
  const { data: filterOptions } = useSWR<{
    departments: Department[];
    roles: Role[];
  }>("filterOptions");
  const departments = filterOptions?.departments || [];
  const roles = filterOptions?.roles || [];

  const handleApplyFilters = () => {
    const filters: Record<string, string> = {};

    if (tempFilters.department && tempFilters.department !== "all") {
      filters.department = tempFilters.department;
    }

    if (tempFilters.role && tempFilters.role !== "all") {
      filters.role = tempFilters.role;
    }

    setFilters(filters);
  };

  const handleClearFilters = () => {
    setTempFilters({
      department: "all",
      role: "all",
    });
    resetFilters();
  };

  const FilterComponent = (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          variant="bordered"
          startContent={<FiFilter className="h-4 w-4" />}
          size="md"
          className={`${buttonStyles} bg-brand-red-dark text-white min-w-[48px]`}
        >
          <span className="sm:inline hidden">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="py-4 px-6 space-y-4 w-[350px]">
        <p className="self-start text-sm-plus text-brand-black font-extrabold">
          Filters
        </p>

        {isFiltersLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </>
        ) : (
          <>
            <Select
              label="Department"
              placeholder="Select department"
              variant="bordered"
              defaultSelectedKeys={["all"]}
              selectedKeys={[tempFilters.department]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString() || "all";
                setTempFilters((prev) => ({ ...prev, department: value }));
              }}
            >
              <>
                <SelectItem key="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id}>{dept.name}</SelectItem>
                ))}
              </>
            </Select>

            <Select
              label="Role"
              placeholder="Select role"
              variant="bordered"
              defaultSelectedKeys={["all"]}
              selectedKeys={[tempFilters.role]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0]?.toString() || "all";
                setTempFilters((prev) => ({ ...prev, role: value }));
              }}
            >
              <>
                <SelectItem key="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id}>{role.name}</SelectItem>
                ))}
              </>
            </Select>
          </>
        )}

        <div className="flex justify-end gap-2 mt-4 w-full">
          <Button
            variant="light"
            color="danger"
            onPress={handleClearFilters}
            className={`text-brand-red-dark w-1/2 ${buttonStyles}`}
          >
            Clear
          </Button>
          <Button
            color="primary"
            onPress={handleApplyFilters}
            className={`bg-brand-red-dark text-white w-1/2 ${buttonStyles}`}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <AdminToolbar
      searchPlaceholder="Search users..."
      onSearch={setSearchQuery}
      addButtonLabel="Add User"
      onAdd={addUser}
      filterComponent={FilterComponent}
    />
  );
}
