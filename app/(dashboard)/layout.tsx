import React from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/auth-guard";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-zinc-950 p-3 text-zinc-100 md:p-4">
      <div className="flex min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 shadow-[0_28px_90px_rgba(0,0,0,0.45)] md:min-h-[calc(100vh-2rem)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader userName={user.name} userImage={user.image} />
          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
