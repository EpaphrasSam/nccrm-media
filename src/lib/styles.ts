export const inputStyles = {
  label: "text-base font-medium pb-2",
  inputWrapper: "py-6 rounded-xlg",
  trigger: "py-6 rounded-xlg",
  base: "border-brand-gray-light",
  error: "border-brand-red",
  focus: "focus:border-brand-green focus:ring-brand-green",
  value: "capitalize",
} as const;

export const buttonStyles = "py-6 rounded-xlg border-none";

export const tableStyles = {
  base: "min-h-[400px] custom-scrollbar",
  table: "min-w-full",
  thead: "bg-default-50",
  wrapper: "border-1 bg-white shadow-sm rounded-xlg px-0",
  tr: "border-b transition-colors",
  th: "bg-transparent text-brand-black-light text-sm font-semibold tracking-wider text-left py-4 px-6",
  td: "py-4 px-6 align-middle whitespace-nowrap text-sm",
} as const;

export const checkboxStyles =
  "[&>span]:after:!bg-brand-red [&>span]:before:group-data-[selected=true]:!border-brand-red";
