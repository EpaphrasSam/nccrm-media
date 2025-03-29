"use client";

import { AnalysisHeader } from "./AnalysisHeader";
import { AnalysisForm } from "./AnalysisForm";
import { ThematicAreaSelector } from "./ThematicAreaSelector";

export function AnalysisContainer() {
  return (
    <div className="max-w-6xl mx-auto space-y-2">
      <AnalysisHeader />

      <div className="bg-white shadow-md rounded-lg min-lg:p-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:min-h-[calc(100vh-8rem)]">
          <ThematicAreaSelector />
          <AnalysisForm />
        </div>
      </div>
    </div>
  );
}
