import React from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/auth-guard";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#172554_0%,#090d1a_35%,#040711_100%)] text-zinc-100">
      <Sidebar />
      <div className="md:ml-60">
        <DashboardHeader userName={user.name} userImage={user.image} />
        <main className="px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
