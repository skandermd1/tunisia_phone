import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_PRODUCT_PARAMS = new Set([
  "brand", "category", "search", "min_price", "max_price",
  "sort", "page", "per_page", "featured",
]);

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/produits") {
    let hasGarbage = false;
    const clean = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (VALID_PRODUCT_PARAMS.has(key) && value) {
        clean.set(key, value);
      } else {
        hasGarbage = true;
      }
    });
    if (hasGarbage) {
      const query = clean.toString();
      const url = request.nextUrl.clone();
      url.search = query ? `?${query}` : "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/produits",
};
