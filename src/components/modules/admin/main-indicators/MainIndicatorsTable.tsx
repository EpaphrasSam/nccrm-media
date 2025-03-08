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
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles, buttonStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { useState } from "react";
import type {
  MainIndicatorStatus,
  MainIndicatorListItem,
} from "@/services/main-indicators/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Main Indicator" },
  { key: "description", label: "Description" },
  { key: "thematic_area", label: "Thematic Area" },
  { key: "created_at", label: "Date Created" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

const StatusText = ({ status }: { status: MainIndicatorStatus }) => {
  const color = status === "active" ? "text-success" : "text-default-400";
  return (
    <span className={color}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export function MainIndicatorsTable() {
  const {
    mainIndicators,
    editMainIndicator,
    deleteMainIndicator,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useMainIndicatorsStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMainIndicatorId, setSelectedMainIndicatorId] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (mainIndicatorId: string) => {
    setSelectedMainIndicatorId(mainIndicatorId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMainIndicatorId) return;

    setIsDeleting(true);
    try {
      await deleteMainIndicator(selectedMainIndicatorId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedMainIndicatorId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="space-y-4">
      <Table aria-label="Main Indicators table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No main indicators found">
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
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
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
            mainIndicators.map((mainIndicator: MainIndicatorListItem) => (
              <TableRow key={mainIndicator.id}>
                <TableCell className="font-medium">
                  {mainIndicator.name}
                </TableCell>
                <TableCell className="min-w-[300px] max-w-[400px] whitespace-normal">
                  {mainIndicator.description}
                </TableCell>
                <TableCell>{mainIndicator.thematic_area.name}</TableCell>
                <TableCell>
                  {new Date(mainIndicator.created_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell>
                  <StatusText status={mainIndicator.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-2">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editMainIndicator(mainIndicator)}
                      className={buttonStyles}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      size="sm"
                      onPress={() => handleDeleteClick(mainIndicator.id)}
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
        title="Delete Main Indicator"
        description="Are you sure you want to delete this main indicator? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
