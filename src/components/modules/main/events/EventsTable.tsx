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
  Spinner,
} from "@heroui/react";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2, FiMoreVertical, FiCheck, FiX } from "react-icons/fi";
import { useEventsStore } from "@/store/events";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";
import { getStatusColor } from "@/lib/constants";
import { usePermissions } from "@/hooks/usePermissions";
import type { Event } from "@/services/events/types";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "reporter", label: "Reporter" },
  { key: "incidentType", label: "Incident Type" },
  { key: "region", label: "Region (District)" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
] as const;

const StatusText = ({ status }: { status: string }) => {
  const color = getStatusColor(status);
  return (
    <span className="text-sm font-semibold capitalize" style={{ color }}>
      {status}
    </span>
  );
};

export function EventsTable() {
  const {
    events,
    editEvent,
    deleteEvent,
    validateEvent,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useEventsStore();

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingAction, setLoadingAction] = useState<{
    eventId: string;
    action: string;
  } | null>(null);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleDeleteClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEventId) return;

    setIsDeleting(true);
    try {
      await deleteEvent(selectedEventId);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setSelectedEventId(null);
    }
  };

  const handleApprove = async (id: string) => {
    setLoadingAction({ eventId: id, action: "approve" });
    await validateEvent(id, { status: "approved" });
    setLoadingAction(null);
  };

  const handleReject = async (id: string) => {
    setLoadingAction({ eventId: id, action: "reject" });
    await validateEvent(id, { status: "rejected" });
    setLoadingAction(null);
  };

  const canEdit = hasPermission("event", "edit");
  const canDelete = hasPermission("event", "delete");
  const canApprove = hasPermission("event", "approve");

  return (
    <div className="space-y-4">
      <Table aria-label="Events table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No events found">
          {isTableLoading || permissionsLoading ? (
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
            events.map((event: Event) => (
              <TableRow key={event?.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <HeroUser name={event.reporter?.name || "Unknown"} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {event.sub_indicator?.main_indicator.thematic_area.name ||
                      "Unknown"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {event.region} ({event.district})
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(event.report_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusText status={event.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {canEdit && (
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => editEvent(event)}
                        className="text-brand-green-dark"
                        size="sm"
                        aria-label="Edit event"
                      >
                        <FaRegEdit className="w-4 h-4" color="blue" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        onPress={() => handleDeleteClick(event.id)}
                        color="danger"
                        variant="light"
                        size="sm"
                        aria-label="Delete event"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    )}
                    {canApprove && event?.status === "pending" && (
                      <Dropdown closeOnSelect={false}>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            variant="light"
                            aria-label="More event actions"
                          >
                            <FiMoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Event actions">
                          <DropdownItem
                            key="approve"
                            startContent={
                              loadingAction?.eventId === event.id &&
                              loadingAction?.action === "approve" ? (
                                <Spinner size="sm" />
                              ) : (
                                <FiCheck className="w-4 h-4" />
                              )
                            }
                            onPress={() => handleApprove(event.id)}
                            isDisabled={
                              loadingAction?.eventId === event.id &&
                              loadingAction?.action === "approve"
                            }
                            className="text-success"
                          >
                            Approve
                          </DropdownItem>
                          <DropdownItem
                            key="reject"
                            startContent={
                              loadingAction?.eventId === event.id &&
                              loadingAction?.action === "reject" ? (
                                <Spinner size="sm" />
                              ) : (
                                <FiX className="w-4 h-4" />
                              )
                            }
                            onPress={() => handleReject(event.id)}
                            isDisabled={
                              loadingAction?.eventId === event.id &&
                              loadingAction?.action === "reject"
                            }
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

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
