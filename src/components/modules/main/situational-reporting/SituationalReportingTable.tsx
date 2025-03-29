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
import { FaRegEdit, FaChartBar } from "react-icons/fa";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { useRouter } from "next/navigation";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
  { key: "year", label: "Year" },
  { key: "actions", label: "Actions" },
] as const;

export function SituationalReportingTable() {
  const {
    reports,
    editReport,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useSituationalReportingStore();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleViewAnalysis = (reportId: string) => {
    router.push(`/situational-reporting/analysis/${reportId}`);
  };

  return (
    <div className="space-y-4">
      <Table aria-label="Situational reports table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No situational reports found">
          {isTableLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
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
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <span className="text-sm font-semibold">{report.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{report.year}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => editReport(report)}
                      className="text-brand-green-dark"
                      size="sm"
                    >
                      <FaRegEdit className="w-4 h-4" color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => handleViewAnalysis(report.id)}
                      className="text-brand-green-dark"
                      size="sm"
                    >
                      <FaChartBar className="w-4 h-4" />
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
            currentPage={filters.page || 1}
            pageSize={filters.limit || 10}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
