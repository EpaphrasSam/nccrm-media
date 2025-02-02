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
import { useDepartmentsStore } from "@/store/departments";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { DepartmentStatus } from "@/services/departments/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Department" },
  { key: "createdAt", label: "Date Created" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

const StatusText = ({ status }: { status: DepartmentStatus }) => {
  const color = status === "active" ? "text-success" : "text-default-400";
  return (
    <span className={color}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export function DepartmentsTable() {
  const {
    filteredDepartments,
    editDepartment,
    deleteDepartment,
    isLoading,
    currentPage,
    pageSize,
    setCurrentPage,
    totalDepartments,
  } = useDepartmentsStore();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Table aria-label="Departments table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No departments found">
          {isLoading ? (
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
            paginatedDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>
                  {new Date(department.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <StatusText status={department.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editDepartment(department)}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => deleteDepartment(department.id)}
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
        total={totalDepartments}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
