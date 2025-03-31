"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Skeleton,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { FiCheck, FiX, FiUser, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { useUsersStore } from "@/store/users";
import { tableStyles, buttonStyles } from "@/lib/styles";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { getStatusColor, USER_STATUSES } from "@/lib/constants";
import { Pagination } from "@/components/common/navigation/Pagination";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

// Helper functions for role colors
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

const getColorForRole = (role: string) => {
  if (!roleColors[role]) {
    roleColors[role] = generateRandomColor();
  }
  return roleColors[role];
};

const RoleChip = ({ role }: { role: string }) => {
  const backgroundColor = getColorForRole(role);
  const textColor = getContrastColor(backgroundColor);

  if (!role)
    return (
      <p className="text-sm font-semibold capitalize text-gray-600">No role</p>
    );

  return (
    <div
      className="px-3 py-1 rounded-full text-xs font-semibold inline-flex capitalize"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {role}
    </div>
  );
};

const StatusText = ({ status }: { status: string }) => {
  const color = getStatusColor(status);
  return (
    <span className="text-sm font-semibold capitalize" style={{ color }}>
      {status}
    </span>
  );
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
    updateUser,
    departments,
    roles,
  } = useUsersStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

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

  const handleApprove = async (userId: string) => {
    try {
      await validateUser(userId, { status: "approved" });
      setSelectedUserId(userId);
      setAssignmentModalOpen(true);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = (userId: string) => {
    validateUser(userId, { status: "rejected" });
  };

  const handleAssignmentConfirm = async () => {
    if (!selectedUserId || !selectedDepartment || !selectedRole) return;

    setIsAssigning(true);
    try {
      await updateUser(selectedUserId, {
        department_id: selectedDepartment,
        role_id: selectedRole,
      });
      setAssignmentModalOpen(false);
      setSelectedUserId(null);
      setSelectedDepartment("");
      setSelectedRole("");
    } catch (error) {
      console.error("Error assigning role and department:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssignmentCancel = () => {
    setAssignmentModalOpen(false);
    setSelectedUserId(null);
    setSelectedDepartment("");
    setSelectedRole("");
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
              <TableRow key={user?.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user?.image}
                      fallback={
                        <FiUser className="w-6 h-6 text-brand-green-dark" />
                      }
                      size="md"
                      isBordered
                    />
                    <div>
                      <p className="font-semibold text-brand-black-dark">
                        {user?.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user?.department?.name || (
                    <p className="text-sm font-semibold capitalize text-gray-600">
                      No department
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <RoleChip role={user?.role?.name} />
                </TableCell>
                <TableCell>
                  <StatusText status={user?.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => editUser(user)}
                      className="text-brand-green-dark"
                      size="sm"
                    >
                      <FaRegEdit className="w-4 h-4 " color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => handleDeleteClick(user?.id)}
                      size="sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                    {user?.status === USER_STATUSES.PENDING_VERIFICATION && (
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="light">
                            <FiMoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User actions">
                          <DropdownItem
                            key="approve"
                            startContent={<FiCheck className="w-4 h-4" />}
                            onPress={() => handleApprove(user?.id)}
                            className="text-success"
                          >
                            Approve
                          </DropdownItem>
                          <DropdownItem
                            key="reject"
                            startContent={<FiX className="w-4 h-4" />}
                            onPress={() => handleReject(user?.id)}
                            className="text-danger"
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
        total={totalPages}
        currentPage={filters.page || 1}
        onPageChange={handlePageChange}
        pageSize={filters.limit || 10}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        isLoading={isDeleting}
      />

      <Modal
        isOpen={assignmentModalOpen}
        onClose={handleAssignmentCancel}
        placement="center"
        classNames={{
          base: "max-w-md",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Assign Role and Department
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Select
                    label="Department"
                    placeholder="Select a department"
                    selectedKeys={
                      selectedDepartment ? [selectedDepartment] : []
                    }
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0]?.toString();
                      if (value) setSelectedDepartment(value);
                    }}
                  >
                    {departments?.map((dept: { id: string; name: string }) => (
                      <SelectItem key={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Role"
                    placeholder="Select a role"
                    selectedKeys={selectedRole ? [selectedRole] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0]?.toString();
                      if (value) setSelectedRole(value);
                    }}
                  >
                    {roles?.map((role: { id: string; name: string }) => (
                      <SelectItem key={role.id}>{role.name}</SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  disabled={isAssigning}
                  className={`${buttonStyles}`}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleAssignmentConfirm}
                  isLoading={isAssigning}
                  isDisabled={!selectedDepartment || !selectedRole}
                  className={`${buttonStyles} bg-brand-red-dark text-white`}
                >
                  Assign
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
