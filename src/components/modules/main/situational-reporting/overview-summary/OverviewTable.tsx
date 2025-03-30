// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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

interface TableRowData extends Record<string, number | string> {
  year: string;
}

export function OverviewTable() {
  const { overviewData, isOverviewTableLoading } =
    useSituationalReportingStore();

  // Extract unique thematic areas from all years
  const thematicAreas = Object.values(overviewData).reduce(
    (areas, yearData) => {
      Object.keys(yearData).forEach((area) => {
        if (!areas.includes(area)) {
          areas.push(area);
        }
      });
      return areas;
    },
    [] as string[]
  );

  // Transform data for table display
  const tableData = Object.entries(overviewData).map(([year, scores]) => ({
    year,
    ...scores,
  })) as TableRowData[];

  // Loading state - show skeleton table
  if (isOverviewTableLoading) {
    return (
      <div className="space-y-4">
        <Table aria-label="Loading overview summary" classNames={tableStyles}>
          <TableHeader>
            <TableColumn>
              <Skeleton className="h-5 w-16" />
            </TableColumn>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableColumn key={`header-skeleton-${index}`}>
                <Skeleton className="h-5 w-24" />
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <TableRow key={`loading-row-${rowIndex}`}>
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <TableCell key={`loading-cell-${rowIndex}-${colIndex}`}>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Empty state - show simple message
  if (tableData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="w-full border rounded-lg p-8 h-[300px]">
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            No data available
          </div>
        </div>
      </div>
    );
  }

  // Data state - show full table with data
  return (
    <div className="space-y-4">
      <Table aria-label="Overview summary table" classNames={tableStyles}>
        <TableHeader>
          <TableColumn>Year</TableColumn>
          {thematicAreas.map((area) => (
            <TableColumn key={area}>{area}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.year}>
              <TableCell>
                <span className="text-sm font-semibold">{row.year}</span>
              </TableCell>
              {thematicAreas.map((area) => (
                <TableCell key={`${row.year}-${area}`}>
                  <div
                    className={`px-2 py-1 rounded-xl text-center min-w-20 w-fit text-sm ${getScoreColor(
                      Number(row[area]) || 0
                    )}`}
                  >
                    {(Number(row[area]) || 0).toFixed(2)}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
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
