"use client";

import {
  Pagination as HeroPagination,
  PaginationItemType,
  PaginationItemRenderProps,
} from "@heroui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const renderItem = ({
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className: itemClassName,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      const hasNextPage = currentPage < totalPages;
      return (
        <button
          key={key}
          className={`${itemClassName} w-full inline-flex items-center gap-2 text-sm-plus font-extrabold ${
            hasNextPage ? "text-brand-red" : "text-gray-400"
          }`}
          onClick={onNext}
          disabled={!hasNextPage}
        >
          <span>Next</span>
          <FiChevronRight className="size-4" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      const hasPrevPage = currentPage > 1;
      return (
        <button
          key={key}
          className={`${itemClassName} w-full inline-flex items-center gap-2 text-sm-plus font-extrabold ${
            hasPrevPage ? "text-brand-red" : "text-gray-400"
          }`}
          onClick={onPrevious}
          disabled={!hasPrevPage}
        >
          <FiChevronLeft className="size-4" />
          <span>Previous</span>
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={itemClassName}>
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        className={`${itemClassName} min-w-fit h-[40px] text-sm-plus font-extrabold ${
          isActive ? "text-brand-red" : "text-brand-black"
        }`}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="flex justify-center items-center">
      <HeroPagination
        total={totalPages}
        page={currentPage}
        onChange={onPageChange}
        showControls
        variant="light"
        size="md"
        radius="lg"
        className={`gap-2 ${className}`}
        renderItem={renderItem}
        disableCursorAnimation
      />
    </div>
  );
}
