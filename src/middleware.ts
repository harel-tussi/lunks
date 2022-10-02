import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. /public all root files inside public (e.g. /favicon.ico)
     */
    "/",
    "/((?!api|_next|trpc|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
};

const DEV_HOST_NAME = "localhost:3000";
const PROD_HOST_NAME = "localhost:3000";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.localhost:3000, app.localhost:3000)
  const hostname = req.headers.get("host") || PROD_HOST_NAME;

  // creating current host
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname.replace("." + PROD_HOST_NAME, "")
      : //   .replace(`.platformize.vercel.app`, "")
        hostname.replace("." + DEV_HOST_NAME, "");

  // rewrites for app pages
  if (currentHost == "app") {
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (hostname === "localhost:3000" || hostname === "platformize.vercel.app") {
    url.pathname = `/home${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  url.pathname = `/_sites/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);
}
