"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Skeleton,
  Button,
} from "@heroui/react";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { useRolesStore } from "@/store/roles";
import { tableStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { Pagination } from "@/components/common/navigation/Pagination";
import { usePermissions } from "@/hooks/usePermissions";
import type { RoleListItem } from "@/services/roles/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
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

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

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

  const canEditRole = hasPermission("role", "edit");
  const canDeleteRole = hasPermission("role", "delete");

  return (
    <div className="space-y-4">
      <Table aria-label="Roles table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No roles found">
          {isTableLoading || permissionsLoading ? (
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
            roles.map((role: RoleListItem) => (
              <TableRow key={role.id}>
                <TableCell>
                  <p className="font-semibold text-brand-black-dark">
                    {role.name}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {role.description}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {canEditRole && (
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => editRole(role)}
                        className="text-brand-green-dark"
                        size="sm"
                        aria-label="Edit role"
                      >
                        <FaRegEdit className="w-4 h-4" color="blue" />
                      </Button>
                    )}
                    {canDeleteRole && (
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onPress={() => handleDeleteClick(role.id)}
                        size="sm"
                        aria-label="Delete role"
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
