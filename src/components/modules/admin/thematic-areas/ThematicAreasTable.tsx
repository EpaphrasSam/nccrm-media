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
import { useThematicAreasStore } from "@/store/thematic-areas";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { ThematicAreaStatus } from "@/services/thematic-areas/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Thematic Area" },
  { key: "description", label: "Description" },
  { key: "createdAt", label: "Date Created" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

const StatusText = ({ status }: { status: ThematicAreaStatus }) => {
  const color = status === "active" ? "text-success" : "text-default-400";
  return (
    <span className={color}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export function ThematicAreasTable() {
  const {
    filteredThematicAreas,
    editThematicArea,
    isLoading,
    currentPage,
    pageSize,
    setCurrentPage,
    totalThematicAreas,
  } = useThematicAreasStore();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAreas = filteredThematicAreas.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Table aria-label="Thematic Areas table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No thematic areas found">
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
                      <Skeleton className="h-6 w-20 rounded-lg" />
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
            paginatedAreas.map((area) => (
              <TableRow key={area.id}>
                <TableCell className="font-medium w-[200px]">
                  {area.name}
                </TableCell>
                <TableCell className="min-w-[300px] max-w-[400px] whitespace-normal">
                  {area.description}
                </TableCell>
                <TableCell className="w-[180px]">
                  {new Date(area.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="w-[120px]">
                  <StatusText status={area.status} />
                </TableCell>
                <TableCell className="w-[100px]">
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editThematicArea(area)}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        total={totalThematicAreas}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
