"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
} from "@heroui/react";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { tableStyles } from "@/lib/styles";

const LOADING_SKELETON_COUNT = 5;

const columns = [
  { key: "thematic_area", label: "Thematic Area" },
  { key: "average_score", label: "Average Score" },
] as const;

export function OverviewTable() {
  const { overviewData, isOverviewTableLoading } =
    useSituationalReportingStore();

  return (
    <div className="space-y-4">
      <Table aria-label="Overview summary table" classNames={tableStyles}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent="No available data ">
          {isOverviewTableLoading ? (
            <>
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          ) : (
            overviewData.map((item) => (
              <TableRow key={item.thematic_area}>
                <TableCell>
                  <span className="text-sm font-semibold">
                    {item.thematic_area}
                  </span>
                </TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-1 rounded-xl text-center min-w-20 w-fit text-sm ${getScoreColor(
                      item.average_score
                    )}`}
                  >
                    {item.average_score.toFixed(2)}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score <= 20) return "bg-red-100 text-red-800";
  if (score <= 40) return "bg-orange-100 text-orange-800";
  if (score <= 60) return "bg-yellow-100 text-yellow-800";
  if (score <= 80) return "bg-blue-100 text-blue-800";
  return "bg-green-100 text-green-800";
}
