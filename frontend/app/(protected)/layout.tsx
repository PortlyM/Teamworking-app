"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LinkPanel from "@/components/LinkPanel";
import LogoutButton from "@/components/LogoutButton";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold">Sprawdzanie uprawnień...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Teamworking App</h1>
      <LinkPanel />
      <LogoutButton />

      <main className="p-8">{children}</main>
    </div>
  );
}
