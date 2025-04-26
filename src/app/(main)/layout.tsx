import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { SessionProvider } from "@/context/SessionProvider";
import { serverFetchUser } from "@/services/users/actions";
import { auth } from "@/utils/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = await serverFetchUser();

  return (
    <SessionProvider session={session} user={user}>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
