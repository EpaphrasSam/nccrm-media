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
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { MainIndicatorStatus } from "@/services/main-indicators/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Main Indicator" },
  { key: "description", label: "Description" },
  { key: "thematicArea", label: "Thematic Area" },
  { key: "createdAt", label: "Date Created" },
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
    filteredMainIndicators,
    editMainIndicator,
    deleteMainIndicator,
    isLoading,
    currentPage,
    pageSize,
    setCurrentPage,
    totalMainIndicators,
  } = useMainIndicatorsStore();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMainIndicators = filteredMainIndicators.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="space-y-4">
      <Table aria-label="Main Indicators table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No main indicators found">
          {isLoading ? (
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
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          ) : (
            paginatedMainIndicators.map((mainIndicator) => (
              <TableRow key={mainIndicator.id}>
                <TableCell className="font-medium">
                  {mainIndicator.name}
                </TableCell>
                <TableCell className="min-w-[300px] max-w-[400px] whitespace-normal">
                  {mainIndicator.description}
                </TableCell>
                <TableCell>{mainIndicator.thematicArea}</TableCell>
                <TableCell>
                  {new Date(mainIndicator.createdAt).toLocaleDateString(
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
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editMainIndicator(mainIndicator)}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => deleteMainIndicator(mainIndicator.id)}
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
        total={totalMainIndicators}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
