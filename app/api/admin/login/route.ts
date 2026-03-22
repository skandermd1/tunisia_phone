import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jsonResponse, errorResponse, getJsonBody } from "@/lib/api-helpers";
import { signJWT, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const data = await getJsonBody(request);
    const { username, password } = data as { username?: string; password?: string };

    if (!username || !password) {
      return errorResponse("Username and password are required");
    }

    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (rows.length === 0) {
      return errorResponse("Invalid username or password", 401);
    }

    const admin = rows[0];
    if (!verifyPassword(password, admin.passwordHash)) {
      return errorResponse("Invalid username or password", 401);
    }

    // Update last login
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, admin.id));

    const token = signJWT({
      sub: admin.id,
      username: admin.username,
      display_name: admin.displayName,
    });

    return jsonResponse({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.displayName,
      },
      expires_in: 86400,
    });
  } catch (err) {
    console.error("POST /api/admin/login error:", err);
    return errorResponse("Internal server error", 500);
  }
}
