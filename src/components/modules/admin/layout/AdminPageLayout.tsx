import { ReactNode } from "react";

interface AdminPageLayoutProps {
  header: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
}

export function AdminPageLayout({
  header,
  toolbar,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="space-y-12">
      {header}
      <div className="space-y-6">
        {toolbar}
        {children}
      </div>
    </div>
  );
}
