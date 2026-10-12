"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function StoreNavbar() {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <Navbar />;
}
