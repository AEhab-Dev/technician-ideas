"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main className={isAdmin ? "" : "min-h-screen"}>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
