"use client";

// import { Card } from "@heroui/react";
import { Header } from "./HeaderSection";
import { Form } from "./Form";
import { Categories } from "./Categories";

export function SituationalContainer() {
  return (
    <div className="  p-4 md:p-6 max-w-6xl mx-auto">
      <Header 
        title="Situational Reporting"
        description="Fill in the details for situational reporting"
      />

      <div className="p-4 md:p-6 mt-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <Categories />
          <Form />
        </div>
      </div>
    </div>
  );
} 