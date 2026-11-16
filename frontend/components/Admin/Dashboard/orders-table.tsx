"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/dashboard";
import { useRecentOrders } from "@/hooks/admin/use-admin-dashboard";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  delivered: { bg: "#dcfce7", color: "#15803d" },
  processing: { bg: "#dbeafe", color: "#1d4ed8" },
  shipped: { bg: "#ede9fe", color: "#6d28d9" },
  pending: { bg: "#fef3c7", color: "#a16207" },
  cancelled: { bg: "#fee2e2", color: "#b91c1c" },
};

function statusStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase()] ?? { bg: "#f3f4f6", color: "#374151" };
}

export default function RecentOrders() {
  const t = useTranslations("ADMIN_DASHBOARD");
  const tStatus = useTranslations("ADMIN_ORDERS");
  const ordersQuery = useRecentOrders(10);
  const orders = ordersQuery.data ?? [];
  const loading = ordersQuery.isPending;
  const error = ordersQuery.isError ? t("LOAD_RECENT_ERROR") : null;

  const statusLabel = (status: string) => {
    const key = status.toUpperCase();
    const known = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    return known.includes(key) ? tStatus(key as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED") : status;
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-background p-12 text-center shadow-soft">
        <p className="text-lg font-semibold text-foreground">{t("NO_RECENT_TITLE")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("NO_RECENT_DESC")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-semibold">{t("COL_ORDER")}</th>
              <th className="px-5 py-3 font-semibold">{t("COL_CUSTOMER")}</th>
              <th className="px-5 py-3 font-semibold">{t("COL_ITEMS")}</th>
              <th className="px-5 py-3 font-semibold">{t("COL_STATUS")}</th>
              <th className="px-5 py-3 font-semibold text-right">{t("COL_AMOUNT")}</th>
              <th className="px-5 py-3 font-semibold">{t("COL_DATE")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const s = statusStyle(order.status);
              return (
                <tr key={order.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-5 py-4 font-mono text-xs text-foreground/80">#{order.id.slice(-8)}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-foreground">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="max-w-xs space-y-0.5">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="truncate text-foreground/80">
                          {item.quantity}× {item.product}{" "}
                          <span className="text-muted-foreground">({item.color})</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-muted-foreground">{t("MORE_ITEMS", { count: order.items.length - 2 })}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium")}
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-foreground">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{formatDate(order.date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
