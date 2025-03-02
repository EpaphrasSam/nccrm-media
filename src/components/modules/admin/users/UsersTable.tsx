"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Skeleton,
  Button,
  Pagination,
} from "@heroui/react";
import { FiEdit2, FiCheck, FiX, FiUser } from "react-icons/fi";
import { useUsersStore } from "@/store/users";
import { tableStyles } from "@/lib/styles";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

// Helper functions for colors
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getContrastColor = (hexcolor: string) => {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

// Store generated colors to ensure consistency
const roleColors: Record<string, string> = {};
const statusColors: Record<string, string> = {};

const getColorForRole = (role: string) => {
  if (!roleColors[role]) {
    roleColors[role] = generateRandomColor();
  }
  return roleColors[role];
};

const getColorForStatus = (status: string) => {
  if (!statusColors[status]) {
    statusColors[status] = generateRandomColor();
  }
  return statusColors[status];
};

const RoleChip = ({ role }: { role: string }) => {
  const backgroundColor = getColorForRole(role);
  const textColor = getContrastColor(backgroundColor);

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor, color: textColor }}
    >
      {role}
    </span>
  );
};

const StatusText = ({ status }: { status: string }) => {
  const color = getColorForStatus(status);
  return <span style={{ color }}>{status}</span>;
};

export function UsersTable() {
  const {
    users,
    editUser,
    deleteUser,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
    validateUser,
  } = useUsersStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserId) return;

    setIsDeleting(true);
    try {
      await deleteUser(selectedUserId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedUserId(null);
    }
  };

  const handleApprove = (userId: string) => {
    validateUser(userId, { status: "approved" });
  };

  const handleReject = (userId: string) => {
    validateUser(userId, { status: "rejected" });
  };

  return (
    <div className="space-y-4">
      <Table aria-label="Users table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No users found">
          {isTableLoading ? (
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
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FiUser className="w-10 h-10 text-brand-green-dark" />
                    <div>
                      <p className="font-semibold text-brand-black-dark">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.department.name}</TableCell>
                <TableCell>
                  <RoleChip role={user.role.name} />
                </TableCell>
                <TableCell>
                  <StatusText status={user.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => editUser(user)}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => handleDeleteClick(user.id)}
                    >
                      <FiX className="w-4 h-4" />
                    </Button>
                    {user.status === "pending" && (
                      <>
                        <Button
                          isIconOnly
                          color="success"
                          variant="light"
                          onPress={() => handleApprove(user.id)}
                        >
                          <FiCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onPress={() => handleReject(user.id)}
                        >
                          <FiX className="w-4 h-4" />
                        </Button>
                      </>
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
            page={filters.page || 1}
            onChange={handlePageChange}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
