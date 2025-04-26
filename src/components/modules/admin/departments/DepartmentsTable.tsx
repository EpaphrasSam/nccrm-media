"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Skeleton,
} from "@heroui/react";
import { FiTrash2 } from "react-icons/fi";
import { useDepartmentsStore } from "@/store/departments";
import { tableStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { FaRegEdit } from "react-icons/fa";
import { Pagination } from "@/components/common/navigation/Pagination";
import { usePermissions } from "@/hooks/usePermissions";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "created_at", label: "Date created" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function DepartmentsTable() {
  const {
    departments,
    editDepartment,
    deleteDepartment,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useDepartmentsStore();

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleDeleteClick = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartmentId) return;

    setIsDeleting(true);
    try {
      await deleteDepartment(selectedDepartmentId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedDepartmentId(null);
    }
  };

  const canEditDept = hasPermission("department", "edit");
  const canDeleteDept = hasPermission("department", "delete");

  return (
    <div className="space-y-4">
      <Table aria-label="Departments table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No departments found">
          {isTableLoading || permissionsLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          ) : (
            departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{formatDate(department.created_at)}</TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-semibold capitalize ${
                      department.status === "active"
                        ? "text-success"
                        : "text-default-400"
                    }`}
                  >
                    {department.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {canEditDept && (
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => editDepartment(department)}
                        className="text-brand-green-dark"
                        size="sm"
                        aria-label="Edit department"
                      >
                        <FaRegEdit className="w-4 h-4" color="blue" />
                      </Button>
                    )}
                    {canDeleteDept && (
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onPress={() => handleDeleteClick(department.id)}
                        size="sm"
                        aria-label="Delete department"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        total={totalPages}
        currentPage={filters.page || 1}
        onPageChange={handlePageChange}
        pageSize={filters.limit || 10}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
