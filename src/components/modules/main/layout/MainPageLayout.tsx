import { ReactNode } from "react";

interface MainPageLayoutProps {
  header: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
}

export function MainPageLayout({
  header,
  toolbar,
  children,
}: MainPageLayoutProps) {
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
