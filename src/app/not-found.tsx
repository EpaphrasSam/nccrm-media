"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@heroui/react";
import { VscError } from "react-icons/vsc";
import { buttonStyles } from "@/lib/styles";

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen items-center justify-center flex-grow p-4 sm:p-8 pt-16">
      <div className="flex flex-col items-center p-8 bg-content1 rounded-lg shadow-lg text-center max-w-lg w-full border border-divider">
        <VscError className="text-warning text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-warning mb-3">
          404 - Page Not Found
        </h1>
        <p className="text-foreground-700 mb-4 text-lg">
          The page you are looking for does not exist or has been moved.
        </p>
        <p className="text-foreground-500 mb-8 text-sm">
          Please check the URL or return to the homepage.
        </p>
        <Button
          as={Link}
          href="/"
          color="primary"
          className={`${buttonStyles} px-8 py-2`}
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
}
