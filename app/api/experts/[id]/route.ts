import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { patchExpertSchema } from "@/lib/schemas/schema";
import prisma from "@/prisma/client";
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // const session = await getServerSession(authOptions);

  // if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = patchExpertSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { is_approved } = body;

  const updateStartup = await prisma.experts.update({
    where: { id: Number(params.id) },
    data: {
      is_approved,
    },
  });

  revalidateTag("startups");

  return Response.json({ revalidated: true, data: updateStartup });
}
