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
  Pagination,
  Skeleton,
} from "@heroui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDepartmentsStore } from "@/store/departments";
import { buttonStyles, tableStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "NAME" },
  { key: "description", label: "DESCRIPTION" },
  { key: "created_at", label: "CREATED AT" },
  { key: "updated_at", label: "UPDATED AT" },
  { key: "actions", label: "ACTIONS" },
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

  return (
    <div className="space-y-4">
      <Table aria-label="Departments table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No departments found">
          {isTableLoading ? (
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
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                <TableCell>{formatDate(department.updated_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => editDepartment(department)}
                      className={buttonStyles}
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteClick(department.id)}
                      className={buttonStyles}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!isTableLoading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={filters.page || 1}
            onChange={handlePageChange}
          />
        </div>
      )}

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
