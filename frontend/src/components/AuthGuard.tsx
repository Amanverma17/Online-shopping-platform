"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function AuthGuard({
  children,
  adminOnly = false,
}: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (adminOnly) {
      try {
        const payload = JSON.parse(
          atob(token.split(".")[1])
        );

        if (payload.role !== "admin") {
          router.replace("/");
          return;
        }
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }
    }

    setChecking(false);
  }, [router, adminOnly]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}