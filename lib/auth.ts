import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorResponse } from "./api-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "tp_dev_secret_key";
const JWT_EXPIRY = 86400; // 24 hours

interface JWTPayload {
  sub: number;
  username: string;
  display_name: string | null;
  iat: number;
  exp: number;
}

export function signJWT(payload: {
  sub: number;
  username: string;
  display_name: string | null;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function authenticate(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: errorResponse("Non autorise", 401), payload: null };
  }

  const token = authHeader.slice(7);
  const payload = verifyJWT(token);
  if (!payload) {
    return { error: errorResponse("Token invalide ou expire", 401), payload: null };
  }

  return { error: null, payload };
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  // bcryptjs handles PHP's $2y$ prefix by treating it as $2a$
  return bcrypt.compareSync(password, hash);
}
