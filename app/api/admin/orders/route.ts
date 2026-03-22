import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, and, ilike, gte, lte, or, count, sql, desc } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get("per_page")) || 20));
    const offset = (page - 1) * perPage;

    const conditions = [];
    if (status) {
      conditions.push(eq(orders.status, status as typeof orders.status.enumValues[number]));
    }
    if (search) {
      conditions.push(
        or(
          ilike(orders.orderNumber, `%${search}%`),
          ilike(orders.customerName, `%${search}%`),
          ilike(orders.customerPhone, `%${search}%`)
        )!
      );
    }
    if (dateFrom) conditions.push(gte(orders.createdAt, new Date(dateFrom)));
    if (dateTo) conditions.push(lte(orders.createdAt, new Date(dateTo + "T23:59:59")));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total: totalCount }] = await db
      .select({ total: count() })
      .from(orders)
      .where(where);

    const rows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        customerPhone: orders.customerPhone,
        customerAddress: orders.customerAddress,
        customerCity: orders.customerCity,
        customerGovernorate: orders.customerGovernorate,
        notes: orders.notes,
        subtotal: orders.subtotal,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        itemsCount: sql<number>`(SELECT count(*) FROM order_items oi WHERE oi.order_id = ${orders.id})`,
      })
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(perPage)
      .offset(offset);

    return jsonResponse({
      orders: rows.map((o) => ({
        id: o.id,
        order_number: o.orderNumber,
        customer_name: o.customerName,
        customer_phone: o.customerPhone,
        customer_address: o.customerAddress,
        customer_city: o.customerCity,
        customer_governorate: o.customerGovernorate,
        notes: o.notes,
        subtotal: Number(o.subtotal),
        total: Number(o.total),
        status: o.status,
        created_at: o.createdAt,
        updated_at: o.updatedAt,
        items_count: Number(o.itemsCount),
      })),
      total: totalCount,
      page,
      per_page: perPage,
      total_pages: Math.ceil(totalCount / perPage),
    });
  } catch (err) {
    console.error("GET /api/admin/orders error:", err);
    return errorResponse("Internal server error", 500);
  }
}
