"use client";

import { ShoppingCart, RotateCcw, Truck, Check, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOrderStatus } from "@/hooks/admin/use-admin-dashboard";

type StatusCard = {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

export default function StatusOverview() {
  const t = useTranslations("ADMIN_DASHBOARD");
  const orderQuery = useOrderStatus();
  const orderData = orderQuery.data;
  const loading = orderQuery.isPending;
  const error = orderQuery.isError ? t("LOAD_ORDER_ERROR") : null;

  const cards: StatusCard[] = [
    { title: t("TOTAL_ORDERS"), value: orderData?.total ?? 0, icon: ShoppingCart, iconBg: "#fed7aa", iconColor: "#ea580c" },
    { title: t("ORDERS_PENDING"), value: orderData?.pending ?? 0, icon: RotateCcw, iconBg: "#bbf7d0", iconColor: "#15803d" },
    { title: t("ORDERS_PROCESSING"), value: orderData?.processing ?? 0, icon: Truck, iconBg: "#bfdbfe", iconColor: "#1d4ed8" },
    { title: t("ORDERS_DELIVERED"), value: orderData?.delivered ?? 0, icon: Check, iconBg: "#bbf7d0", iconColor: "#15803d" },
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {cards.map(({ title, value, icon: Icon, iconBg, iconColor }) => (
        <div
          key={title}
          className="flex items-center gap-4 rounded-2xl border border-border bg-background p-6 shadow-soft"
        >
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="space-y-1.5">
            <div className="text-sm text-foreground/80">{title}</div>
            <div className="text-2xl font-bold tabular-nums leading-none text-foreground">
              {loading ? <span className="inline-block h-6 w-10 animate-pulse rounded bg-muted" /> : value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
