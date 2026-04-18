import React from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/auth-guard";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-9xl border-x border-zinc-800">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader userName={user.name} userImage={user.image} />
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
