"use client";

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
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { useRolesStore } from "@/store/roles";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles, buttonStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { useState } from "react";
import type { RoleListItem } from "@/services/roles/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Role" },
  { key: "description", label: "Description" },
  { key: "created_at", label: "Date Created" },
  { key: "actions", label: "Actions" },
] as const;

export function RolesTable() {
  const {
    roles,
    editRole,
    deleteRole,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useRolesStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDeleteClick = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRoleId) return;

    setIsDeleting(true);
    try {
      await deleteRole(selectedRoleId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedRoleId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Table aria-label="Roles table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No roles found">
          {isTableLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-96" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-start gap-1">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          ) : (
            roles.map((role: RoleListItem) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell className="min-w-[300px] max-w-[400px] whitespace-normal">
                  {role.description}
                </TableCell>
                <TableCell>
                  {new Date(role.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-2">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editRole(role)}
                      className={buttonStyles}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      size="sm"
                      onPress={() => handleDeleteClick(role.id)}
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

      <Pagination
        total={totalPages}
        pageSize={filters.limit}
        currentPage={filters.page}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
