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
import { useRolesStore } from "@/store/roles";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Role" },
  { key: "description", label: "Description" },
  { key: "createdAt", label: "Date Created" },
  { key: "actions", label: "Actions" },
] as const;

export function RolesTable() {
  const {
    filteredRoles,
    editRole,
    deleteRole,
    isLoading,
    currentPage,
    pageSize,
    setCurrentPage,
    totalRoles,
  } = useRolesStore();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Table aria-label="Roles table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No roles found">
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
            paginatedRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium w-[200px]">
                  {role.name}
                </TableCell>
                <TableCell className="min-w-[300px] max-w-[400px] whitespace-normal">
                  {role.description}
                </TableCell>
                <TableCell className="w-[180px]">
                  {new Date(role.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="w-[100px]">
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editRole(role)}
                    >
                      <FaRegEdit size={18} color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => deleteRole(role.id)}
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
        total={totalRoles}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
