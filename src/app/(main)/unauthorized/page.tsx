"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@heroui/react";
import { VscError } from "react-icons/vsc";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 pt-16">
      <div className="flex flex-col items-center p-8 bg-content1 rounded-lg shadow-lg text-center max-w-lg w-full border border-divider">
        <VscError className="text-danger text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-danger mb-3">Access Denied</h1>
        <p className="text-foreground-700 mb-4 text-lg">
          You do not have the necessary permissions to view this page.
        </p>
        <p className="text-foreground-500 mb-8 text-sm">
          If you believe you should have access, please contact your system
          administrator.
        </p>
        <Button as={Link} href="/" color="primary" className="px-8 py-2">
          Return to Homepage
        </Button>
      </div>
    </div>
  );
}
