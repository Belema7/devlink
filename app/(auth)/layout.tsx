import React from "react";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <span className="text-lg font-semibold tracking-tight">DevLink</span>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
