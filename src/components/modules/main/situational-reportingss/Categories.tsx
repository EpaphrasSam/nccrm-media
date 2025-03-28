"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("Criminality");
  const categories = ["Criminality", "Politics", "Health", "Environment"];

  return (
    <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-dashed border-blue-200 pb-4 lg:pb-0 lg:pr-4 bg-[#FFF5F5] rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-4 scrollbar-hide">
        <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 lg:gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="light"
              onPress={() => setSelectedCategory(category)}
              className={`whitespace-nowrap lg:whitespace-normal text-left px-6 py-3 rounded-lg text-md font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-[#AC0000] text-white"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 