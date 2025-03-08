"use client";

import { Input } from "@heroui/react";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { inputStyles } from "@/lib/styles";
import { IoSearchOutline } from "react-icons/io5";

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  onSearch,
  placeholder = "Search",
  className = "",
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      onSearch(searchValue);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleChange = (value: string) => {
    setValue(value);
    debouncedSearch(value);
  };

  return (
    <Input
      value={value}
      onValueChange={handleChange}
      placeholder={placeholder}
      startContent={<IoSearchOutline size={26} className="text-brand-gray" />}
      radius="sm"
      size="md"
      variant="bordered"
      classNames={inputStyles}
      className={className}
    />
  );
}
