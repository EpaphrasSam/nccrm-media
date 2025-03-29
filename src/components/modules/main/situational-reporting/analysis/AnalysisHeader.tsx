"use client";

import { buttonStyles } from "@/lib/styles";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useState } from "react";
export function AnalysisHeader() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const statistics = [
    { count: 26, label: "Road Traffic Offence" },
    { count: 16, label: "Rape" },
    { count: 16, label: "Child abuse" },
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-end text-right mb-4 w-full">
        <div className="w-full">
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                color="primary"
                variant="bordered"
                className={`bg-brand-red-dark text-white px-8 ${buttonStyles}`}
              >
                View Statistics
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white p-3 rounded-lg shadow-lg mt-2">
              <div className="space-y-3 w-[250px]">
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {statistics.map((stat, index) => (
                    <div key={index} className="bg-[#FFF5F5] p-2 rounded-lg">
                      <div className="text-xl font-bold text-[#AC0000]">
                        {stat.count}
                      </div>
                      <div className="text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
