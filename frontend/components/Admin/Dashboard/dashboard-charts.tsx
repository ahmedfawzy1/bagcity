"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTranslations } from "next-intl";
import { useChartData } from "@/hooks/admin/use-admin-dashboard";

const TAB_COLORS = {
  sales: "#10b981",
  orders: "#2563eb",
} as const;

export default function DashboardCharts() {
  const t = useTranslations("ADMIN_DASHBOARD");
  const [tab, setTab] = useState<"sales" | "orders">("sales");
  const chartQuery = useChartData();

  const chartData = chartQuery.data;
  const loading = chartQuery.isPending;
  const error = chartQuery.isError ? t("LOAD_CHART_ERROR") : null;

  const lineChartData = chartData?.weeklyData || [];
  const dataKey = tab === "sales" ? "sales" : "orders";
  const chartColor = TAB_COLORS[tab];
  const bestSellingProducts = chartData?.bestSellingProducts || [];

  const tabLabels = {
    sales: t("TAB_SALES"),
    orders: t("TAB_ORDERS"),
  } as const;

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-foreground">{t("WEEKLY_SALES")}</h3>
        </div>

        <div className="flex gap-1 border-b border-border mb-5">
          {(["sales", "orders"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="relative px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: tab === key ? TAB_COLORS[key] : "#6b7280",
              }}
            >
              {tabLabels[key]}
              {tab === key && (
                <span
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                  style={{ backgroundColor: TAB_COLORS[key] }}
                />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-60 animate-pulse rounded-md bg-muted" />
        ) : (
          <div className="rounded-lg bg-muted/30 p-2">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={chartColor} strokeWidth={3} dot={{ r: 3, fill: chartColor }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
        <h3 className="font-semibold text-lg text-foreground mb-5">{t("BEST_SELLING")}</h3>

        {loading ? (
          <div className="h-60 animate-pulse rounded-md bg-muted" />
        ) : bestSellingProducts.length === 0 ? (
          <div className="grid h-60 place-items-center text-center">
            <div>
              <p className="text-sm font-medium text-foreground">{t("NO_SALES_TITLE")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("NO_SALES_DESC")}</p>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={bestSellingProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {bestSellingProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {bestSellingProducts.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-foreground/80">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
