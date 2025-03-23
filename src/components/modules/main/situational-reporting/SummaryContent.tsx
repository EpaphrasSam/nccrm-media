"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { MainPageHeader } from "@/components/modules/main/layout/MainPageHeader";

const summaryData = [
  {
    timeFrame: "2023-01",
    situations: {
      Criminality: "21.12",
      Politics: "21.12",
      Health: "12.54",
      Environment: "21.21"
    }
  },
  {
    timeFrame: "2023-02",
    situations: {
      Criminality: "46.22",
      Politics: "18.92",
      Health: "48.78",
      Environment: "29.25"
    }
  },
  // Add more data as needed
];

export function SummaryContent() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6">
      <MainPageHeader 
        title="Summary Report"
        description="Overview of situational reporting statistics across different categories"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 mb-6">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <Button 
            variant="solid" 
            className="bg-[#AC0000] text-white w-full sm:w-auto"
            onPress={() => router.back()}
          >
            Back
          </Button>
          <Button 
            variant="light" 
            className="text-black w-full sm:w-auto"
          >
            Export Excel
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">From</span>
            <input type="date" className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">To</span>
            <input type="date" className="border rounded px-2 py-1 w-full" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left whitespace-nowrap" rowSpan={2}>Time Frame</th>
              <th className="p-4 text-center" colSpan={4}>Situations</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-center whitespace-nowrap">Criminality</th>
              <th className="px-4 py-2 text-center whitespace-nowrap">Politics</th>
              <th className="px-4 py-2 text-center whitespace-nowrap">Health</th>
              <th className="px-4 py-2 text-center whitespace-nowrap">Environment</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="p-4 whitespace-nowrap">{row.timeFrame}</td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-yellow-200 px-2 py-1 rounded inline-block w-full sm:w-auto">
                    {row.situations.Criminality}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-yellow-200 px-2 py-1 rounded inline-block w-full sm:w-auto">
                    {row.situations.Politics}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-green-200 px-2 py-1 rounded inline-block w-full sm:w-auto">
                    {row.situations.Health}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-yellow-200 px-2 py-1 rounded inline-block w-full sm:w-auto">
                    {row.situations.Environment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 