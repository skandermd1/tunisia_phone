import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    const rows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        status: orders.status,
        subtotal: orders.subtotal,
        total: orders.total,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    if (rows.length === 0) {
      return errorResponse("Order not found", 404);
    }

    const order = rows[0];

    const items = await db
      .select({
        productName: orderItems.productName,
        variantLabel: orderItems.variantLabel,
        price: orderItems.price,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return jsonResponse({
      order_number: order.orderNumber,
      customer_name: order.customerName,
      status: order.status,
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      items: items.map((i) => ({
        product_name: i.productName,
        variant_label: i.variantLabel,
        price: Number(i.price),
        quantity: i.quantity,
      })),
    });
  } catch (err) {
    console.error("GET /api/orders/track error:", err);
    return errorResponse("Internal server error", 500);
  }
}
