"use client";

import { Layers, RefreshCw, Calendar, TrendingUp, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/dashboard";
import { useSalesOverview } from "@/hooks/admin/use-admin-dashboard";

type Tile = {
  title: string;
  value: string;
  icon: LucideIcon;
  bg: string;
};

export default function SalesOverview() {
  const t = useTranslations("ADMIN_DASHBOARD");
  const salesQuery = useSalesOverview();
  const salesData = salesQuery.data;
  const loading = salesQuery.isPending;
  const error = salesQuery.isError ? t("LOAD_SALES_ERROR") : null;

  const tiles: Tile[] = [
    { title: t("TODAY_ORDERS"), value: salesData ? formatCurrency(salesData.today) : "$0.00", icon: Layers, bg: "#0d9488" },
    { title: t("YESTERDAY_ORDERS"), value: salesData ? formatCurrency(salesData.yesterday) : "$0.00", icon: Layers, bg: "#f59e0b" },
    { title: t("THIS_MONTH"), value: salesData ? formatCurrency(salesData.thisMonth) : "$0.00", icon: RefreshCw, bg: "#3b82f6" },
    { title: t("LAST_MONTH"), value: salesData ? formatCurrency(salesData.lastMonth) : "$0.00", icon: Calendar, bg: "#0e7490" },
    { title: t("ALL_TIME_SALES"), value: salesData ? formatCurrency(salesData.allTime) : "$0.00", icon: TrendingUp, bg: "#15803d" },
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {tiles.map(({ title, value, icon: Icon, bg }) => (
        <div
          key={title}
          style={{ backgroundColor: bg, color: "#fff" }}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl px-5 py-6 text-center shadow-soft"
        >
          <Icon className="h-7 w-7" />
          <div className="text-sm font-medium">{title}</div>
          <div className="text-2xl font-bold tabular-nums leading-none">
            {loading ? <span className="inline-block h-6 w-24 animate-pulse rounded bg-white/25" /> : value}
          </div>
        </div>
      ))}
    </div>
  );
}
