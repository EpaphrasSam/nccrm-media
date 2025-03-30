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
import { FiTrash2 } from "react-icons/fi";
import { useEventsStore } from "@/store/events";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/common/modals/DeleteConfirmationModal";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "reporter", label: "Reporter" },
  { key: "incidentType", label: "Incident Type" },
  { key: "region", label: "Region" },
  { key: "date", label: "Date" },
  { key: "actions", label: "Actions" },
] as const;

export function EventsTable() {
  const {
    events,
    editEvent,
    deleteEvent,
    isTableLoading,
    filters,
    setFilters,
    totalPages,
  } = useEventsStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  console.log(events);

  return (
    <div className="space-y-4">
      <Table aria-label="Events table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No events found">
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
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
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
            events.map((event) => (
              <TableRow key={event.id}>
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
                    {event.region?.name || "Unknown"}
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
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => editEvent(event)}
                      className="text-brand-green-dark"
                      size="sm"
                    >
                      <FaRegEdit className="w-4 h-4" color="blue" />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => handleDeleteClick(event.id)}
                      size="sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
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
