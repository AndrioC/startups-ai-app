import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

export interface CompanyTable {
  id: number;
  companyName: string;
  createdAt: Date;
  logo: string | null;
  logoSidebar: string | null;
  isPaying: boolean;
  users: {
    name: string;
    email: string;
    password?: string;
    is_blocked: boolean;
  }[];
  hasBlockedUsers: boolean;
}

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME = process.env
  .S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;
  const companyName = url.searchParams.get("companyName");
  const companyCreatedAt = url.searchParams.get("companyCreatedAt");

  const where: any = {};

  if (companyName) {
    where.name = {
      contains: companyName,
      mode: "insensitive",
    };
  }

  if (companyCreatedAt) {
    const parsedCreatedAt = new Date(companyCreatedAt);
    if (!isNaN(parsedCreatedAt.getTime())) {
      parsedCreatedAt.setHours(0, 0, 0, 0);

      where.created_at = {
        gte: parsedCreatedAt,
        lt: new Date(parsedCreatedAt.getTime() + 24 * 60 * 60 * 1000),
      };
    }
  }

  try {
    const [companies, companyCount] = await Promise.all([
      prisma.organizations.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              is_blocked: true,
            },
          },
        },
      }),
      prisma.organizations.count({ where }),
    ]);

    const companyTable: CompanyTable[] = companies.map((value) => ({
      id: value.id,
      companyName: value.name,
      createdAt: value.created_at,
      logo: value?.logo_img
        ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${value?.logo_img}`
        : null,
      logoSidebar: value?.logo_sidebar
        ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${value?.logo_sidebar}`
        : null,
      isPaying: value.payment_needed,
      users: value.user.map((user) => ({
        name: user.name,
        email: user.email,
        is_blocked: user.is_blocked,
      })),
      hasBlockedUsers: value.user.some((user) => user.is_blocked),
    }));

    companyTable.sort((a, b) => {
      if (a.hasBlockedUsers !== b.hasBlockedUsers) {
        return a.hasBlockedUsers ? 1 : -1;
      }
      return a.companyName.localeCompare(b.companyName);
    });

    const paginatedCompanies = companyTable.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    return NextResponse.json(
      { companyTable: paginatedCompanies, companyCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
