import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  console.log("Middleware çalışıyor. Token:", token);

  if (!token) {
    console.log("Token bulunamadı, giriş sayfasına yönlendiriliyor.");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Tüm rotalarda çalış
};
