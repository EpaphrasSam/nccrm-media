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
import { IoTrashSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { SubIndicatorStatus } from "@/services/sub-indicators/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Sub Indicator" },
  { key: "mainIndicator", label: "Main Indicator" },
  { key: "createdAt", label: "Date Created" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

const StatusText = ({ status }: { status: SubIndicatorStatus }) => {
  const color = status === "active" ? "text-success" : "text-default-400";
  return (
    <span className={color}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export function SubIndicatorsTable() {
  const {
    filteredSubIndicators,
    editSubIndicator,
    deleteSubIndicator,
    isLoading,
    currentPage,
    pageSize,
    setCurrentPage,
    totalSubIndicators,
  } = useSubIndicatorsStore();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSubIndicators = filteredSubIndicators.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="space-y-4">
      <Table aria-label="Sub Indicators table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No sub indicators found">
          {isLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
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
                      <div className="flex items-center justify-start gap-1">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          ) : (
            paginatedSubIndicators.map((subIndicator) => (
              <TableRow key={subIndicator.id}>
                <TableCell className="font-medium">
                  {subIndicator.name}
                </TableCell>
                <TableCell>{subIndicator.mainIndicator}</TableCell>
                <TableCell>
                  {new Date(subIndicator.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell>
                  <StatusText status={subIndicator.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editSubIndicator(subIndicator)}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => deleteSubIndicator(subIndicator.id)}
                    >
                      <IoTrashSharp size={18} color="red" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        total={totalSubIndicators}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
