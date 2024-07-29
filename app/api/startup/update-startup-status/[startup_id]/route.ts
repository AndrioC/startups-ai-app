import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { patchStartupSchema } from "@/lib/schemas/schema";
import prisma from "@/prisma/client";
export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  // const session = await getServerSession(authOptions);

  // if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = patchStartupSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { is_approved } = body;

  const updateStartup = await prisma.startups.update({
    where: { id: Number(params.startup_id) },
    data: {
      is_approved,
    },
  });

  revalidateTag("startups");

  return Response.json({ revalidated: true, data: updateStartup });
}
