"use client";
import { useEffect } from "react";

export default function FunnelDataPage() {
  useEffect(() => {
    window.location.replace("https://pg-domo-analytics-kg-git-main-kegreenpgs-projects.vercel.app/");
  }, []);

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#8b95a7] text-sm">Redirecting to funnel data…</p>
    </div>
  );
}
