import { NextResponse } from "next/server";

import subdomains from "./subdomains.json";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: any) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  const allowedDomains = ["localhost:3000", "tudominio.com"];

  const isAllowedDomain = allowedDomains.some((domain) =>
    hostname.includes(domain)
  );

  const subdomain = hostname.split(".")[0];

  if (isAllowedDomain && !subdomains.some((d) => d.subdomain === subdomain)) {
    return NextResponse.next();
  }

  const subdomainData = subdomains.find((d) => d.subdomain === subdomain);

  if (subdomainData) {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${url.pathname}`, req.url)
    );
  }

  return new Response(null, { status: 404 });
}
