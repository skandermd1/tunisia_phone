import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, count, sum, sql, desc } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";

export async function GET(request: Request) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const [totalOrders] = await db.select({ v: count() }).from(orders);
    const [pendingOrders] = await db
      .select({ v: count() })
      .from(orders)
      .where(eq(orders.status, "pending"));
    const [revenue] = await db
      .select({ v: sum(orders.total) })
      .from(orders)
      .where(eq(orders.status, "delivered"));
    const [totalProducts] = await db
      .select({ v: count() })
      .from(products)
      .where(eq(products.isActive, true));

    const recentOrders = await db
      .select({
        id: orders.id,
        order_number: orders.orderNumber,
        customer_name: orders.customerName,
        total: orders.total,
        status: orders.status,
        created_at: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const statusRows = await db
      .select({
        status: orders.status,
        count: count(),
      })
      .from(orders)
      .groupBy(orders.status);

    const ordersByStatus: Record<string, number> = {};
    for (const row of statusRows) {
      ordersByStatus[row.status] = row.count;
    }

    return jsonResponse({
      total_orders: totalOrders.v,
      pending_orders: pendingOrders.v,
      total_revenue: Number(revenue.v ?? 0),
      total_products: totalProducts.v,
      recent_orders: recentOrders.map((o) => ({
        ...o,
        total: Number(o.total),
      })),
      orders_by_status: ordersByStatus,
    });
  } catch (err) {
    console.error("GET /api/admin/dashboard error:", err);
    return errorResponse("Internal server error", 500);
  }
}
