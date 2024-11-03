import { NextResponse } from "next/server";

import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const subdomains = await prisma.organizations.findMany({
      select: { slug: true, slug_admin: true },
    });

    const combinedSubdomains = subdomains.flatMap((s) => [
      s.slug,
      s.slug_admin,
    ]);

    return new NextResponse(JSON.stringify(combinedSubdomains), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Subdomains API error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch subdomains" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
