import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const fetchUrl = hostname.includes("localhost")
    ? "http://localhost:3000/api/subdomains"
    : "https://sgl.startups-globallink.com/api/subdomains";

  const res = await fetch(fetchUrl);

  if (!res.ok) {
    return new Response("Failed to fetch subdomains", { status: 500 });
  }

  const data = await res.json();

  const allowedDomains = ["localhost:3000", "startups-globallink.com"];
  const allowedSubDomains = data.map((d: { slug: string }) => d.slug);

  const subdomain = hostname.split(".")[0];

  const isAllowedDomain = allowedDomains.includes(hostname);

  const isAllowedSubDomain = allowedSubDomains.includes(subdomain);

  if (isAllowedDomain) {
    return NextResponse.next();
  }

  if (isAllowedSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${url.pathname}`, req.url)
    );
  }

  return new Response("Subdomain not allowed!", { status: 403 });
}
