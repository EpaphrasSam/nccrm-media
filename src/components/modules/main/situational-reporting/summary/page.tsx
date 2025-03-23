"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

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

export default function SummaryPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <Button 
            variant="solid" 
            className="bg-[#AC0000] text-white"
            onPress={() => router.back()}
          >
            Back
          </Button>
          <Button variant="bordered" className="border-[#AC0000] text-[#AC0000]">
            Export Excel
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">From</span>
            <input type="date" className="border rounded px-2 py-1" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">To</span>
            <input type="date" className="border rounded px-2 py-1" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Time Frame</th>
              <th className="p-4 text-left">Situations</th>
            </tr>
            <tr className="bg-gray-50">
              <th></th>
              <th className="px-4 py-2">Criminality</th>
              <th className="px-4 py-2">Politics</th>
              <th className="px-4 py-2">Health</th>
              <th className="px-4 py-2">Environment</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="p-4">{row.timeFrame}</td>
                <td className="px-4 py-2">
                  <span className="bg-yellow-200 px-2 py-1 rounded">
                    {row.situations.Criminality}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="bg-yellow-200 px-2 py-1 rounded">
                    {row.situations.Politics}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="bg-green-200 px-2 py-1 rounded">
                    {row.situations.Health}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="bg-yellow-200 px-2 py-1 rounded">
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