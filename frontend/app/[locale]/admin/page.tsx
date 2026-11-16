"use client";

import { useTranslations } from "next-intl";
import SalesOverview from "@/components/Admin/Dashboard/SalesOverview";
import StatusOverview from "@/components/Admin/Dashboard/StatusOverview";
import DashboardCharts from "@/components/Admin/Dashboard/dashboard-charts";
import RecentOrders from "@/components/Admin/Dashboard/orders-table";

export default function Dashboard() {
  const t = useTranslations("ADMIN");
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">{t("DASHBOARD_TITLE")}</h1>

      <SalesOverview />
      <StatusOverview />
      <DashboardCharts />

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">{t("RECENT_ORDERS")}</h2>
        <RecentOrders />
      </section>
    </div>
  );
}
