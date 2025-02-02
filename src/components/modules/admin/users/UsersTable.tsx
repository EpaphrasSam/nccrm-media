"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User as HeroUser,
  Button,
  Skeleton,
} from "@heroui/react";
import { FaRegEdit } from "react-icons/fa";
import {
  UserRole,
  UserStatus,
  ROLE_COLORS,
  STATUS_COLORS,
} from "@/lib/constants";
import { useUsersStore } from "@/store/users";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

const RoleChip = ({ role }: { role: UserRole }) => (
  <div
    style={{
      backgroundColor: `${ROLE_COLORS[role]}20`,
      color: ROLE_COLORS[role],
    }}
    className="inline-flex py-1.5 px-6 text-xs rounded-full"
  >
    {role}
  </div>
);

const StatusText = ({ status }: { status: UserStatus }) => (
  <span style={{ color: STATUS_COLORS[status] }}>{status}</span>
);

export function UsersTable() {
  const {
    filteredUsers,
    editUser,
    isLoading,
    currentPage,
    pageSize,
    setCurrentPage,
    totalUsers,
  } = useUsersStore();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Table aria-label="Users table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No users found">
          {isLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="rounded-full h-10 w-10 shrink-0" />
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <HeroUser
                    name={user.name}
                    description={user.email}
                    avatarProps={{ src: user.avatarUrl }}
                  />
                </TableCell>
                <TableCell>
                  <RoleChip role={user.role} />
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <StatusText status={user.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editUser(user)}
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
        total={totalUsers}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
