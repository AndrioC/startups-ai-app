import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface DataRequest {
  profile_id: number;
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  // const session = await getServerSession(authOptions);

  // if (!session) return NextResponse.json({}, { status: 401 });

  const data = (await request.json()) as DataRequest;

  await prisma.$transaction(async (prisma) => {
    await prisma.startup_generated_profiles.updateMany({
      where: {
        startup_id: Number(params.startup_id),
        active: true,
      },
      data: {
        active: false,
      },
    });

    await prisma.startup_generated_profiles.update({
      where: { id: data.profile_id },
      data: {
        active: true,
      },
    });
  });

  return NextResponse.json({}, { status: 201 });
}
