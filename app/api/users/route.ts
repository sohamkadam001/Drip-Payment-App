import { prisma } from "@/app/lib/prisma";
import { getuserid } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = getuserid(req as any);

    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    // If query is empty, return an empty array to save DB load
    if (!query) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive"
        },
        NOT: {
          id: userId
        }
      },
      select: {
        id: true,
        username: true
      },
      take: 5, // Limit results for a snappy, premium search dropdown
    });

    return NextResponse.json({ users }, { status: 200 });
    
  } catch (error) {
    console.error("User Search Error:", error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}