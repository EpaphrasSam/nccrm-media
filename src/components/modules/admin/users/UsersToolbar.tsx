"use client";

import { useState } from "react";
import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@heroui/react";
import { FiFilter } from "react-icons/fi";
import { DEPARTMENTS, USER_ROLES } from "@/lib/constants";
import { useUsersStore } from "@/store/users";
import { buttonStyles } from "@/lib/styles";
import { AdminToolbar } from "../layout/AdminToolbar";

export function UsersToolbar() {
  const { setSearchQuery, setFilters, clearFilters, addUser } = useUsersStore();

  const [tempFilters, setTempFilters] = useState({
    department: "all",
    role: "all",
  });

  const handleApplyFilters = () => {
    setFilters(tempFilters.department, tempFilters.role);
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
        <Select
          label="Department"
          placeholder="Select department"
          variant="bordered"
          defaultSelectedKeys={["all"]}
          selectedKeys={[tempFilters.department]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0]?.toString() || "all";
            setTempFilters({ ...tempFilters, department: value });
          }}
        >
          {[
            { key: "all", label: "All Departments" },
            ...Object.values(DEPARTMENTS).map((dept) => ({
              key: dept,
              label: dept,
            })),
          ].map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Role"
          placeholder="Select role"
          variant="bordered"
          defaultSelectedKeys={["all"]}
          selectedKeys={[tempFilters.role]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0]?.toString() || "all";
            setTempFilters({ ...tempFilters, role: value });
          }}
        >
          {[
            { key: "all", label: "All Roles" },
            ...Object.values(USER_ROLES).map((role) => ({
              key: role,
              label: role,
            })),
          ].map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <div className="flex justify-end gap-2 mt-4 w-full">
          <Button
            variant="light"
            color="danger"
            onPress={() => {
              clearFilters();
              setTempFilters({ department: "all", role: "all" });
            }}
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
