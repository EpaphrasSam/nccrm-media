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
  Tooltip,
} from "@heroui/react";
import { FiTrash2, FiEye } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { tableStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { Pagination } from "@/components/common/navigation/Pagination";
import { usePermissions } from "@/hooks/usePermissions";
import { getStatusColor } from "@/lib/constants";
import type { SituationalReport } from "@/services/situational-reporting/types";
import { useRouter } from "next/navigation";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "report_name", label: "Report Name" },
  { key: "period", label: "Period Covered" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const StatusText = ({ status }: { status: string }) => {
  const color = getStatusColor(status);
  return (
    <span className="text-sm font-semibold capitalize" style={{ color }}>
      {status?.replace("_", " ")}
    </span>
  );
};

export function SituationalReportingTable() {
  const {
    reports,
    editReport,
    deleteReport,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useSituationalReportingStore();

  const router = useRouter();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      await deleteReport(selectedId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedId(null);
    }
  };

  const canEditReport = hasPermission("situational_report", "edit");
  const canDeleteReport = hasPermission("situational_report", "delete");
  const canViewAnalysis = hasPermission("situational_report", "view");

  const handleViewAnalysis = (reportId: string) => {
    router.push(`/situational-reporting/analysis/${reportId}/`);
  };

  return (
    <div className="space-y-4">
      <Table aria-label="Situational Reports table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No reports found">
          {isTableLoading || permissionsLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          ) : (
            reports.map((report: SituationalReport) => (
              <TableRow key={report?.id}>
                <TableCell>
                  <p className="font-semibold text-brand-black-dark">
                    {report?.name}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">{report?.year}</p>
                </TableCell>
                <TableCell>
                  <StatusText status={report?.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {canViewAnalysis && (
                      <Tooltip content="View analysis" color="primary">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleViewAnalysis(report.id)}
                          className="text-brand-blue"
                          size="sm"
                          aria-label="View analysis"
                        >
                          <FiEye className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    )}
                    {canEditReport && (
                      <Tooltip content="Edit report" color="primary">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => editReport(report)}
                          className="text-brand-green-dark"
                          size="sm"
                          aria-label="Edit report"
                        >
                          <FaRegEdit className="w-4 h-4" color="blue" />
                        </Button>
                      </Tooltip>
                    )}
                    {canDeleteReport && (
                      <Tooltip content="Delete report" color="danger">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onPress={() => handleDeleteClick(report?.id)}
                          size="sm"
                          aria-label="Delete report"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    )}
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
            pageSize={filters.limit || 10}
            currentPage={filters.page || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Report"
        description="Are you sure you want to delete this report? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
