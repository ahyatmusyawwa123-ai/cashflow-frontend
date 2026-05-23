"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { StatCards } from "@/components/dashboard/stat-cards";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    // ❌ belum login
    if (!userRole) {
      router.push("/login");
    } else {
      setRole(userRole);
    }
  }, [router]);

  // ⏳ biar ga flicker sebelum role kebaca
  if (!role) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h2>

        {/* 🎯 Dynamic text berdasarkan role */}
        <p className="text-muted-foreground">
          {role === "admin" && "Admin panel - kelola seluruh sistem"}
          {role === "pegawai" && "Ajukan peminjaman & lihat riwayat"}
          {role === "hrd" && "Approval peminjaman < 1 juta"}
          {role === "manager" && "Approval peminjaman 1 - 10 juta"}
          {role === "direktur" && "Approval peminjaman > 10 juta"}
          {role === "finance" && "Pencairan & monitoring cicilan"}
        </p>
      </div>

      {/* 🔒 Contoh pembatasan komponen */}
      {role === "admin" && <StatCards />}

      {/* semua role boleh lihat */}
      <DashboardCharts />

      {/* hanya tertentu */}
      {(role === "admin" || role === "finance") && <RecentActivity />}
    </div>
  );
}