'use client';

import { Button, Select, SelectItem, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { useState } from "react";

interface MainIndicatorSectionProps {
  mainIndicators: string[];
}

export function MainIndicatorSection({ mainIndicators }: MainIndicatorSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statisticsData = [
    { count: 26, label: "Road Traffic Offence" },
    { count: 16, label: "Rape" },
    { count: 16, label: "Child abuse" },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Main Indicator</h2>
        <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <Button className="text-white bg-[#AC0000]">
              View Statistics
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-2 bg-white rounded-lg shadow-lg border border-black">
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600">From</label>
                  <input 
                    type="date" 
                    className="border rounded px-1 py-0.5 text-xs"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600">To</label>
                  <input 
                    type="date" 
                    className="border rounded px-1 py-0.5 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                {statisticsData.map((stat, index) => (
                  <div key={index} className="bg-red-50 p-1.5 rounded w-full">
                    <div className="text-lg font-bold text-[#AC0000]">{stat.count}</div>
                    <div className="text-xs text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Select placeholder="Select the main indicator..." className="max-w-md mb-6">
        {mainIndicators.map((indicator) => (
          <SelectItem key={indicator}>{indicator}</SelectItem>
        ))}
      </Select>
    </>
  );
}