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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { FaRegEdit, FaCheck } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { STATUS_COLORS } from "@/lib/constants";
import { useUsersStore } from "@/store/users";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { UserStatus } from "@/services/users/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

// Store generated colors to ensure no repeats
const generatedColors = new Map<string, { bg: string; text: string }>();

// Generate a random hex color
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Get contrasting text color (black or white) based on background color
const getContrastColor = (hexcolor: string) => {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

// Get or generate color for role
const getColorForRole = (role: string) => {
  if (generatedColors.has(role)) {
    return generatedColors.get(role)!;
  }

  let bgColor: string;
  do {
    bgColor = generateRandomColor();
  } while (
    Array.from(generatedColors.values()).some((color) => color.bg === bgColor)
  );

  const textColor = getContrastColor(bgColor);
  const colors = {
    bg: bgColor,
    text: textColor,
  };

  generatedColors.set(role, colors);
  return colors;
};

const RoleChip = ({ role }: { role: string }) => {
  const colors = getColorForRole(role);
  return (
    <div
      className="inline-flex py-1.5 px-6 text-xs rounded-full"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {role}
    </div>
  );
};

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
    approveUser,
    rejectUser,
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
                  <RoleChip role={user.role || "Unknown"} />
                </TableCell>
                <TableCell>{user.department || "Unknown"}</TableCell>
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
                    {user.status === "pending" && (
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="light" size="sm">
                            <BsThreeDotsVertical size={18} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User Actions">
                          <DropdownItem
                            key="approve"
                            color="success"
                            className="text-brand-green"
                            startContent={<FaCheck size={16} />}
                            onPress={() => approveUser(user.id)}
                          >
                            Approve
                          </DropdownItem>
                          <DropdownItem
                            key="reject"
                            color="danger"
                            className="text-brand-red-dark"
                            startContent={<IoMdClose size={18} />}
                            onPress={() => rejectUser(user.id)}
                          >
                            Reject
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    )}
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
