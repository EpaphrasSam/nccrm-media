"use client";

import { useState } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";

export function Form() {
  const [currentStatus, setCurrentStatus] = useState("");
  const [escalationPotential, setEscalationPotential] = useState("");
  const [responseAdequacy, setResponseAdequacy] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState("");
  const [comments, setComments] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const mainIndicators = [
    "Armed Conflict",
    "Civil Unrest",
    "Political Violence",
    "Criminal Activity",
    "Social Tension"
  ];

  const atRiskGroups = ["All/Ambiguous", "Elderly Man", "Elderly Woman", "Man", "Woman", "Boy", "Girl"];

  const statistics = [
    { count: 26, label: "Road Traffic Offence" },
    { count: 16, label: "Rape" },
    { count: 16, label: "Child abuse" }
  ];

  return (
    <div className="w-full lg:w-2/3">
      {/* View Statistics Button - Moved to top */}
      <div className="flex justify-end mb-4 lg:hidden">
        <div className="w-full">
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button 
                variant="solid" 
                className="bg-[#AC0000] text-white px-4 w-full"
              >
                View Statistics
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white p-3 rounded-lg shadow-lg mt-2 max-w-[calc(100vw-2rem)]" style={{ width: 'fit-content' }}>
              <div className="space-y-3">
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
                    <div 
                      key={index} 
                      className="bg-[#FFF5F5] p-2 rounded-lg"
                    >
                      <div className="text-xl font-bold text-[#AC0000]">
                        {stat.count}
                      </div>
                      <div className="text-xs">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Indicator Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Main Indicator</h2>
          <div className="relative hidden lg:block">
            {/* View Statistics for desktop */}
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button 
                  variant="solid" 
                  className="bg-[#AC0000] text-white px-4"
                >
                  View Statistics
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-white p-3 rounded-lg shadow-lg mt-2" style={{ width: 'fit-content' }}>
                <div className="space-y-3">
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
                      <div 
                        key={index} 
                        className="bg-[#FFF5F5] p-2 rounded-lg"
                      >
                        <div className="text-xl font-bold text-[#AC0000]">
                          {stat.count}
                        </div>
                        <div className="text-xs">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Select 
          placeholder="Select the main indicator..."
          selectedKeys={selectedIndicator ? [selectedIndicator] : []}
          onSelectionChange={(keys) => setSelectedIndicator(Array.from(keys)[0] as string)}
          className="w-full"
        >
          {mainIndicators.map((indicator) => (
            <SelectItem key={indicator}>
              {indicator}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Current Status Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Current Status</h2>
        <p className="text-gray-600 mb-4">
          Please assess the overall conditions within this thematic context, from bad to good in the current reporting period
        </p>
        <RadioGroup
          value={currentStatus}
          onValueChange={setCurrentStatus}
          orientation="horizontal"
          className="gap-2 flex-wrap"
          size="sm"
          color="danger"
        >
          {['Bad', 'Somewhat Bad', 'Moderate', 'Somewhat Good', 'Good'].map((option) => (
            <Radio key={option} value={option}>
              {option}
            </Radio>
          ))}
        </RadioGroup>
      </div>

      {/* Escalation Potential Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Escalation Potential</h2>
        <p className="text-gray-600 mb-4">
          Please rate the likeliness of violent escalation taking place within this thematic context in the next reporting period
        </p>
        <RadioGroup
          value={escalationPotential}
          onValueChange={setEscalationPotential}
          orientation="horizontal"
          className="gap-2 "
          size="sm"
          color="danger"
        >
          {['Highly Unlikely', 'Unlikely', 'Possible', 'Likely', 'Highly Likely'].map((option) => (
            <Radio key={option} value={option}>
              {option}
            </Radio>
          ))}
        </RadioGroup>
      </div>

      {/* Response Adequacy Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Response Adequacy</h2>
        <p className="text-gray-600 mb-4">
          Please assess the response adequacy in the scale of absent to well-managed
        </p>
        <RadioGroup
          value={responseAdequacy}
          onValueChange={setResponseAdequacy}
          orientation="horizontal"
          className="gap-2 "
          size="sm"
          color="danger"
        >
          {['No Response', 'Inadequate', 'Somewhat Inadequate', 'Somewhat Adequate', 'Adequate'].map((option) => (
            <Radio key={option} value={option}>
              {option}
            </Radio>
          ))}
        </RadioGroup>
      </div>

      {/* At Risk Groups Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">At Risk Groups</h2>
        <p className="text-gray-600 mb-4">Please select all risk groups (Multiple-choice)</p>
        <div className="flex flex-wrap gap-4">
          {atRiskGroups.map((group) => (
            <Checkbox
                size="sm"
                color="danger"
                
              key={group}
              value={group}
              isSelected={selectedGroups.includes(group)}
              onValueChange={(isSelected) => {
                if (isSelected) {
                  setSelectedGroups([...selectedGroups, group]);
                } else {
                  setSelectedGroups(selectedGroups.filter(g => g !== group));
                }
              }}
            >
              {group}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        <Textarea
          placeholder="Enter any additional details..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full min-h-[150px]"
        />
      </div>

      <div className="flex justify-center">
        <Button className="px-8 bg-[#27632E] text-white">
          Save
        </Button>
      </div>
    </div>
  );
} 