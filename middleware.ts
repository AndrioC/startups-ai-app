import { NextRequest, NextResponse } from "next/server";

import { auth } from "./auth";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

const protectedRoutes = ["/management", "/startup", "/mentor", "/investor"];

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const session = await auth();
  const hostname = req.headers.get("host") || "";

  const timestamp = Date.now();
  const baseUrl = hostname.includes("localhost")
    ? "http://localhost:3000/api/subdomains"
    : "https://sai.startupsai.com.br/api/subdomains";

  const fetchUrl = `${baseUrl}?t=${timestamp}`;

  const res = await fetch(fetchUrl, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    next: {
      revalidate: 0,
      tags: ["subdomains"],
    },
  });

  if (!res.ok) {
    return new Response("Failed to fetch subdomains", { status: 500 });
  }

  const data: string[] = await res.json();

  const allowedDomains = ["localhost:3000", "startupsai.com.br"];
  const subdomain = hostname.split(".")[0];
  const isAllowedDomain = allowedDomains.some((domain) =>
    hostname.endsWith(domain)
  );
  const isAllowedSubDomain = data.includes(subdomain);

  const accessDeniedHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Access Denied</title>
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
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    </body>
    </html>
  `;

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix)
  );

  if (isAllowedDomain || isAllowedSubDomain) {
    if (req.nextUrl.pathname === "/management") {
      const managementHomeURL = new URL("/management/home", req.nextUrl.origin);
      return NextResponse.redirect(managementHomeURL.toString());
    }

    if (req.nextUrl.pathname === "/auth/login" && session?.user) {
      let redirectTo;
      if (session.user.isSAI || session.user.isAdmin) {
        redirectTo = "/management/home";
      } else if (session.user.isInvestor) {
        redirectTo = "/investor";
      } else if (session.user.isStartup) {
        redirectTo = "/startup";
      } else if (session.user.isMentor) {
        redirectTo = "/mentor";
      }
      if (redirectTo) {
        return NextResponse.redirect(new URL(redirectTo, req.nextUrl.origin));
      }
    }

    if (isProtectedRoute && !session) {
      const absoluteURL = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }

    if (session?.user) {
      if (req.nextUrl.pathname.startsWith("/management")) {
        if (req.nextUrl.pathname.startsWith("/management/companies")) {
          if (!session.user.isSAI) {
            return new Response(accessDeniedHTML, {
              status: 403,
              headers: { "Content-Type": "text/html" },
            });
          }
        } else if (!session.user.isSAI && !session.user.isAdmin) {
          return new Response(accessDeniedHTML, {
            status: 403,
            headers: { "Content-Type": "text/html" },
          });
        }
      }

      if (
        req.nextUrl.pathname.startsWith("/startup") &&
        !session.user.isStartup
      ) {
        return new Response(accessDeniedHTML, {
          status: 403,
          headers: { "Content-Type": "text/html" },
        });
      }

      if (
        req.nextUrl.pathname.startsWith("/investor") &&
        !session.user.isInvestor
      ) {
        return new Response(accessDeniedHTML, {
          status: 403,
          headers: { "Content-Type": "text/html" },
        });
      }

      if (
        req.nextUrl.pathname.startsWith("/mentor") &&
        !session.user.isMentor
      ) {
        return new Response(accessDeniedHTML, {
          status: 403,
          headers: { "Content-Type": "text/html" },
        });
      }
    }

    return isAllowedSubDomain
      ? NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
      : NextResponse.next();
  }

  const notFoundHTML = `
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

  return new Response(notFoundHTML, {
    status: 404,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
