"use client";

import { useEffect } from "react";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { Skeleton } from "@heroui/react";

export function ThematicAreaSelector() {
  const {
    thematicAreas,
    currentThematicArea,
    setCurrentThematicArea,
    isAnalysisLoading,
    isFormLoading,
  } = useSituationalReportingStore();

  // Ensure we have a selected thematic area if available
  useEffect(() => {
    if (thematicAreas.length > 0 && !currentThematicArea) {
      setCurrentThematicArea(thematicAreas[0].id);
    }
  }, [thematicAreas, currentThematicArea, setCurrentThematicArea]);

  return (
    <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-dashed border-blue-200 pb-4 lg:pb-0 lg:pr-4 bg-[#FFF5F5] rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden p-4 scrollbar-hide">
        {isFormLoading ? (
          <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 lg:gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-32 lg:w-full rounded-lg" />
            ))}
          </div>
        ) : thematicAreas.length === 0 ? (
          <div className="flex items-center justify-center w-full h-32 text-gray-500 text-center px-4">
            <p>
              No thematic areas available. Please add thematic areas to begin
              analysis.
            </p>
          </div>
        ) : (
          <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 lg:gap-4">
            {thematicAreas.map((area) => (
              <div
                key={area.id}
                role="button"
                onClick={() =>
                  !isAnalysisLoading && setCurrentThematicArea(area.id)
                }
                className={`whitespace-nowrap lg:whitespace-normal text-center px-6 py-3 rounded-lg text-md font-medium transition-colors cursor-pointer ${
                  isAnalysisLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  currentThematicArea === area.id
                    ? "bg-[#AC0000] text-white"
                    : "text-black hover:opacity-75"
                }`}
              >
                {area.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
