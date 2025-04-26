"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  RadioGroup,
  Radio,
  Checkbox,
  Textarea,
  Select,
  SelectItem,
  Skeleton,
} from "@heroui/react";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import type { AnalysisCreateInput } from "@/services/situational-reporting/types";
import { inputStyles } from "@/lib/styles";
import { useParams } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";

const analysisSchema = z.object({
  currentStatus: z.enum([
    "Bad",
    "Somewhat Bad",
    "Moderate",
    "Somewhat Good",
    "Good",
  ]),
  escalationPotential: z.enum([
    "Highly Unlikely",
    "Unlikely",
    "Possible",
    "Likely",
    "Highly Likely",
  ]),
  responseAdequacy: z.enum([
    "No Response",
    "Inadequate",
    "Somewhat Inadequate",
    "Somewhat Adequate",
    "Adequate",
  ]),
  atRiskGroup: z
    .array(z.string())
    .min(1, "Please select at least one risk group"),
  comments: z.string().optional(),
});

type FormData = z.infer<typeof analysisSchema>;

type CurrentStatus = FormData["currentStatus"];
type EscalationPotential = FormData["escalationPotential"];
type ResponseAdequacy = FormData["responseAdequacy"];

const atRiskGroups = [
  "All/Ambiguous",
  "Elderly Man",
  "Elderly Woman",
  "Man",
  "Woman",
  "Boy",
  "Girl",
];

const STATUS_MAP = {
  Bad: 1,
  "Somewhat Bad": 2,
  Moderate: 3,
  "Somewhat Good": 4,
  Good: 5,
} as const;

const ESCALATION_MAP = {
  "Highly Unlikely": 1,
  Unlikely: 2,
  Possible: 3,
  Likely: 4,
  "Highly Likely": 5,
} as const;

const RESPONSE_MAP = {
  "No Response": 1,
  Inadequate: 2,
  "Somewhat Inadequate": 3,
  "Somewhat Adequate": 4,
  Adequate: 5,
} as const;

const getKeyByValue = <T extends Record<string, number>>(
  map: T,
  value: number
): keyof T => Object.keys(map).find((key) => map[key] === value) as keyof T;

export function AnalysisForm() {
  const { reportId } = useParams();
  const {
    mainIndicators,
    currentThematicArea,
    currentMainIndicator,
    currentAnalysis,
    setCurrentMainIndicator,
    isFormLoading,
    isAnalysisLoading,
    createAnalysis,
    getExistingAnalysis,
    updateAnalysis,
  } = useSituationalReportingStore();

  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const canEditAnalysis = hasPermission("situational_analysis", "edit");

  const filteredIndicators = mainIndicators.filter(
    (indicator) => indicator.thematic_area_id === currentThematicArea
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      currentStatus: undefined,
      escalationPotential: undefined,
      responseAdequacy: undefined,
      atRiskGroup: [],
    },
  });

  // Watch radio values for controlled components
  const currentStatusValue = watch("currentStatus");
  const escalationPotentialValue = watch("escalationPotential");
  const responseAdequacyValue = watch("responseAdequacy");

  // Reset form when analysis changes or when main indicator changes
  useEffect(() => {
    const resetFormData = () => {
      reset({
        currentStatus: undefined,
        escalationPotential: undefined,
        responseAdequacy: undefined,
        atRiskGroup: [],
        comments: "",
      });
    };

    if (currentAnalysis) {
      const resetData = {
        currentStatus: getKeyByValue(STATUS_MAP, currentAnalysis.currentStatus),
        escalationPotential: getKeyByValue(
          ESCALATION_MAP,
          currentAnalysis.escalationPotential
        ),
        responseAdequacy: getKeyByValue(
          RESPONSE_MAP,
          currentAnalysis.responseAdequacy
        ),
        atRiskGroup: currentAnalysis.atRiskGroup,
        comments: currentAnalysis.comments,
      };
      reset(resetData);
    } else {
      resetFormData();
    }

    return () => {
      resetFormData();
    };
  }, [currentAnalysis, currentMainIndicator, reset]);

  // Clear form when thematic area changes
  useEffect(() => {
    if (!currentThematicArea) {
      reset({
        currentStatus: undefined,
        escalationPotential: undefined,
        responseAdequacy: undefined,
        atRiskGroup: [],
        comments: "",
      });
    }
  }, [currentThematicArea, reset]);

  // Clear form on unmount or when switching reports
  useEffect(() => {
    return () => {
      reset({
        currentStatus: undefined,
        escalationPotential: undefined,
        responseAdequacy: undefined,
        atRiskGroup: [],
        comments: "",
      });
    };
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    if (!canEditAnalysis) return;
    if (!currentMainIndicator || !reportId) {
      console.error("Missing required IDs");
      return;
    }

    const mappedData = {
      ...data,
      mainIndicatorId: currentMainIndicator,
      situationalReportId: reportId,
      currentStatus: STATUS_MAP[data.currentStatus],
      escalationPotential: ESCALATION_MAP[data.escalationPotential],
      responseAdequacy: RESPONSE_MAP[data.responseAdequacy],
    };

    if (currentAnalysis?.id) {
      await updateAnalysis(
        currentAnalysis.id,
        mappedData as unknown as AnalysisCreateInput
      );
    } else {
      await createAnalysis(mappedData as unknown as AnalysisCreateInput);
    }
  };

  const isLoading = isFormLoading || isAnalysisLoading || permissionsLoading;
  const isFormDisabled =
    isLoading ||
    permissionsLoading ||
    !canEditAnalysis ||
    !currentMainIndicator;

  return (
    <div className="w-full lg:w-2/3 p-4 space-y-8">
      {isFormLoading || permissionsLoading ? (
        // Show skeletons for everything when form or permissions are loading
        <div className="space-y-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <>
          {/* Main Indicator Section */}
          <div>
            <h2 className="text-base font-semibold mb-2">Main Indicator</h2>
            <Select
              placeholder="Select the main indicator..."
              selectedKeys={currentMainIndicator ? [currentMainIndicator] : []}
              onSelectionChange={async (keys) => {
                const id = Array.from(keys)[0] as string;
                setCurrentMainIndicator(id);
                await getExistingAnalysis(id, reportId as string);
              }}
              isDisabled={
                !currentThematicArea ||
                isAnalysisLoading ||
                permissionsLoading ||
                !canEditAnalysis
              }
              disallowEmptySelection
              className="w-full"
              classNames={inputStyles}
            >
              {filteredIndicators.map((indicator) => (
                <SelectItem key={indicator.id}>{indicator.name}</SelectItem>
              ))}
            </Select>
          </div>

          {isAnalysisLoading ? (
            // Show skeletons for just the form fields when analysis is loading
            <div className="space-y-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Current Status Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold">Current Status</h2>
                  <p className="text-gray-600">
                    Please assess the overall conditions within this thematic
                    context, from bad to good in the current reporting period
                  </p>
                </div>
                <RadioGroup
                  value={currentStatusValue}
                  onValueChange={(value: string) =>
                    setValue("currentStatus", value as CurrentStatus)
                  }
                  orientation="horizontal"
                  className="gap-2 flex-wrap"
                  size="sm"
                  color="danger"
                  isDisabled={isFormDisabled}
                  classNames={inputStyles}
                >
                  {[
                    "Bad",
                    "Somewhat Bad",
                    "Moderate",
                    "Somewhat Good",
                    "Good",
                  ].map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
                {errors.currentStatus && (
                  <p className="text-sm text-red-600">
                    {errors.currentStatus.message}
                  </p>
                )}
              </div>

              {/* Escalation Potential Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold">
                    Escalation Potential
                  </h2>
                  <p className="text-gray-600">
                    Please rate the likeliness of violent escalation taking
                    place within this thematic context in the next reporting
                    period
                  </p>
                </div>
                <RadioGroup
                  value={escalationPotentialValue}
                  onValueChange={(value: string) =>
                    setValue(
                      "escalationPotential",
                      value as EscalationPotential
                    )
                  }
                  orientation="horizontal"
                  className="gap-2"
                  size="sm"
                  color="danger"
                  isDisabled={isFormDisabled}
                >
                  {[
                    "Highly Unlikely",
                    "Unlikely",
                    "Possible",
                    "Likely",
                    "Highly Likely",
                  ].map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
                {errors.escalationPotential && (
                  <p className="text-sm text-red-600">
                    {errors.escalationPotential.message}
                  </p>
                )}
              </div>

              {/* Response Adequacy Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold">Response Adequacy</h2>
                  <p className="text-gray-600">
                    Please assess the response adequacy in the scale of absent
                    to well-managed
                  </p>
                </div>
                <RadioGroup
                  value={responseAdequacyValue}
                  onValueChange={(value: string) =>
                    setValue("responseAdequacy", value as ResponseAdequacy)
                  }
                  orientation="horizontal"
                  className="gap-2"
                  size="sm"
                  color="danger"
                  isDisabled={isFormDisabled}
                >
                  {[
                    "No Response",
                    "Inadequate",
                    "Somewhat Inadequate",
                    "Somewhat Adequate",
                    "Adequate",
                  ].map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
                {errors.responseAdequacy && (
                  <p className="text-sm text-red-600">
                    {errors.responseAdequacy.message}
                  </p>
                )}
              </div>

              {/* At Risk Groups Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold">At Risk Groups</h2>
                  <p className="text-gray-600">
                    Please select all risk groups (Multiple-choice)
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {atRiskGroups.map((group) => (
                    <Checkbox
                      key={group}
                      size="sm"
                      color="danger"
                      value={group}
                      {...register("atRiskGroup")}
                      isDisabled={isFormDisabled}
                    >
                      {group}
                    </Checkbox>
                  ))}
                </div>
                {errors.atRiskGroup && (
                  <p className="text-sm text-red-600">
                    {errors.atRiskGroup.message}
                  </p>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h2 className="text-base font-semibold">Comments</h2>
                <Textarea
                  {...register("comments")}
                  placeholder="Enter any additional details..."
                  className="w-full"
                  isDisabled={isFormDisabled}
                  classNames={inputStyles}
                />
                {errors.comments && (
                  <p className="text-sm text-red-600">
                    {errors.comments.message}
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  className="px-8 bg-[#27632E] text-white"
                  onPress={() => handleSubmit(onSubmit)()}
                  isDisabled={isFormDisabled}
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
