import React from "react";
import Navbar from "@/components/layout/navbar";
import { requireUser } from "@/lib/auth-guard";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
