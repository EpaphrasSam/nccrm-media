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
import { FiTrash2 } from "react-icons/fi";
import { useRegionsStore } from "@/store/regions";
import { buttonStyles, tableStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { FaRegEdit } from "react-icons/fa";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
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

export function RegionsTable() {
  const {
    regions,
    editRegion,
    deleteRegion,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useRegionsStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleDeleteClick = (regionId: string) => {
    setSelectedRegionId(regionId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRegionId) return;

    setIsDeleting(true);
    try {
      await deleteRegion(selectedRegionId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedRegionId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Table aria-label="Regions table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No regions found">
          {isTableLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
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
            regions.map((region) => (
              <TableRow key={region.id}>
                <TableCell>{region.name}</TableCell>
                <TableCell>{formatDate(region.created_at)}</TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-semibold capitalize ${
                      region.status === "active"
                        ? "text-success"
                        : "text-default-400"
                    }`}
                  >
                    {region.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => editRegion(region)}
                      className={buttonStyles}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteClick(region.id)}
                      className={buttonStyles}
                    >
                      <FiTrash2 size={18} />
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
        title="Delete Region"
        description="Are you sure you want to delete this region? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
