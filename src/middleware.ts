import { NextResponse, type NextRequest } from "next/server";

// Middleware runs BEFORE rendering. Dynamic route configuration also disables
// Next's Full Route Cache; headers alone cannot override ISR output.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/product-photos/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/api/catalog/photo/" + url.pathname.slice("/product-photos/".length);
    return NextResponse.rewrite(url);
  }
  if (req.nextUrl.pathname.startsWith("/api/catalog/photo/")) return NextResponse.next();
  const res = NextResponse.next();
  for (const name of ["Cache-Control", "CDN-Cache-Control", "Vercel-CDN-Cache-Control"]) {
    res.headers.set(name, "no-store, max-age=0");
  }
  if (req.nextUrl.pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return res;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|media/|favicon.ico).*)"],
};
