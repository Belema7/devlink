import React from "react";
import { requireUser } from "@/lib/auth-guard";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireUser();

  return (
    <>
      <div>
        <header>
          <h1>My Dashboard</h1>
        </header>
        <main>
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
