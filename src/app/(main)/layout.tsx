import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserSyncPoller } from "@/components/common/UserSyncPoller";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserSyncPoller>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
            {children}
          </main>
        </div>
      </div>
    </UserSyncPoller>
  );
}
