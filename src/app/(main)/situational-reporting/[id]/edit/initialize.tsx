"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { situationalReportingService } from "@/services/situational-reporting/api";

interface InitializeSituationalReportingProps {
  id: string;
}

export function InitializeSituationalReporting({
  id,
}: InitializeSituationalReportingProps) {
  const { setFormLoading } = useSituationalReportingStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch report data
  const { isLoading: isReportLoading } = useSWR(
    `report/${id}`,
    async () => {
      try {
        const response = await situationalReportingService.getReport(id);
        const report =
          response && "data" in response ? response.data : response;
        useSituationalReportingStore.setState({
          currentReport: report || undefined,
        });
        return report;
      } finally {
        if (isReportLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isReportLoading) {
      setFormLoading(true);
    }
  }, [isReportLoading, setFormLoading]);

  return null;
}
