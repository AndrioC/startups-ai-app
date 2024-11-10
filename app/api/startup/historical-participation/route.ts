import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export interface HistoricalParticipationTable {
  id: number;
  program_name: string;
  start_date: Date;
  end_date: Date;
  joined_at: Date;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startup_id = searchParams.get("startup_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!startup_id) {
      return NextResponse.json(
        { error: "startup_id is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const participationHistory = await prisma.startup_programs.findMany({
      where: {
        startup_id: Number(startup_id),
        program: {
          is_deleted: false,
        },
      },
      select: {
        joined_at: true,
        program: {
          select: {
            id: true,
            program_name: true,
            start_date: true,
            end_date: true,
          },
        },
      },
      orderBy: {
        joined_at: "desc",
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.startup_programs.count({
      where: {
        startup_id: parseInt(startup_id, 10),
        program: {
          is_deleted: false,
        },
      },
    });

    const formattedHistory = participationHistory.map((entry) => ({
      id: entry.program.id,
      program_name: entry.program.program_name,
      start_date: entry.program.start_date,
      end_date: entry.program.end_date,
      joined_at: entry.joined_at,
    }));

    return NextResponse.json({
      status: 200,
      data: formattedHistory,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      message: "Startup participation history retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving startup participation history:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while retrieving the startup participation history",
      },
      { status: 500 }
    );
  }
}
