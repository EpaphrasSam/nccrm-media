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
import { useEventsStore } from "@/store/events";
import { Pagination } from "@/components/common/navigation/Pagination";
import { tableStyles } from "@/lib/styles";

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
    filteredEvents,
    editEvent,
    isLoading,
    currentPage,
    pageSize,
    setCurrentPage,
    totalEvents,
  } = useEventsStore();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Table aria-label="Events table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No events found">
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
            paginatedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <HeroUser
                    name={event.reporter || "Unknown"}
                    description={event.date}
                  />
                </TableCell>
                <TableCell>{event.subIndicator || "Unknown"}</TableCell>
                <TableCell>{event.region || "Unknown"}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => editEvent(event)}
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
        total={totalEvents}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
