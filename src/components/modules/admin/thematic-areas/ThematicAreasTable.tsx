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
import { useThematicAreasStore } from "@/store/thematic-areas";
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

export function ThematicAreasTable() {
  const {
    thematicAreas,
    editThematicArea,
    deleteThematicArea,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useThematicAreasStore();

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedThematicAreaId, setSelectedThematicAreaId] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleDeleteClick = (thematicAreaId: string) => {
    setSelectedThematicAreaId(thematicAreaId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedThematicAreaId) return;

    setIsDeleting(true);
    try {
      await deleteThematicArea(selectedThematicAreaId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedThematicAreaId(null);
    }
  };

  const canEdit = hasPermission("thematic_area", "edit");
  const canDelete = hasPermission("thematic_area", "delete");

  return (
    <div className="space-y-4">
      <Table aria-label="Thematic areas table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No thematic areas found">
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
            thematicAreas.map((thematicArea) => (
              <TableRow key={thematicArea.id}>
                <TableCell>{thematicArea.name}</TableCell>
                <TableCell>{thematicArea.description}</TableCell>
                <TableCell>{formatDate(thematicArea.created_at)}</TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-semibold capitalize ${
                      thematicArea.status === "active"
                        ? "text-success"
                        : "text-default-400"
                    }`}
                  >
                    {thematicArea.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {canEdit && (
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => editThematicArea(thematicArea)}
                        className="text-brand-green-dark"
                        size="sm"
                        aria-label="Edit thematic area"
                      >
                        <FaRegEdit className="w-4 h-4" color="blue" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onPress={() => handleDeleteClick(thematicArea.id)}
                        size="sm"
                        aria-label="Delete thematic area"
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
        title="Delete Thematic Area"
        description="Are you sure you want to delete this thematic area? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
