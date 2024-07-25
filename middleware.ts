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

  const data: string[] = await res.json();

  const allowedDomains = ["localhost:3000", "startups-globallink.com"];

  const subdomain = hostname.split(".")[0];

  const isAllowedDomain = allowedDomains.includes(hostname);

  const isAllowedSubDomain = data.includes(subdomain);

  if (isAllowedDomain) {
    return NextResponse.next();
  }

  if (isAllowedSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${url.pathname}`, req.url)
    );
  }

  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subdomain Not Found</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
        }
        .container {
          text-align: center;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 90%;
          margin: 0 auto;
        }
        h1 {
          color: #d32f2f;
          font-size: 2rem;
          margin-bottom: 10px;
        }
        p {
          color: #333;
          font-size: 1.2rem;
        }
        @media (max-width: 600px) {
          .container {
            padding: 10px;
          }
          h1 {
            font-size: 1.5rem;
          }
          p {
            font-size: 1rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Subdomain Not Found</h1>
        <p>The subdomain you are trying to access does not exist.</p>
      </div>
    </body>
    </html>
  `;

  return new Response(htmlResponse, {
    status: 404,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
