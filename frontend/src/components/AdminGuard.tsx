"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const profile = await apiFetch("/profile");

        if (profile.role !== "admin") {
          localStorage.removeItem("token");
          router.replace("/admin/login");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error(error);

        localStorage.removeItem("token");
        router.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Checking admin access...</p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}