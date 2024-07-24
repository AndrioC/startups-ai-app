import { programs } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import prisma from "@/prisma/client";

import { auth } from "../../../../../auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: number } }
) {
  const session = await auth();

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const programInfoByToken: programs[] = await prisma.$queryRaw`
      SELECT
        *
      FROM
        programs p
      WHERE
        encode(digest(CAST(id AS text), 'sha1'), 'hex') = ${token};
  `;

  return NextResponse.json(
    { programInfoByToken: programInfoByToken[0] },
    { status: 201 }
  );
}
