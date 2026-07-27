import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "content"; // 'content' | 'judgement'
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    if (type === "judgement") {
      const whereClause = {
        status: "APPROVED" as const,
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { caseName: { contains: search, mode: "insensitive" as const } },
                { caseNo: { contains: search, mode: "insensitive" as const } },
                { summary: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };

      const [judgements, total] = await Promise.all([
        prisma.judgement.findMany({
          where: whereClause,
          include: {
            createdBy: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.judgement.count({ where: whereClause }),
      ]);
      return NextResponse.json({ data: judgements, total, page, limit });
    } else {
      const whereClause = {
        status: "APPROVED" as const,
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { sessionName: { contains: search, mode: "insensitive" as const } },
                { description: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };

      const [content, total] = await Promise.all([
        prisma.content.findMany({
          where: whereClause,
          include: {
            subject: true,
            createdBy: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.content.count({ where: whereClause }),
      ]);
      return NextResponse.json({ data: content, total, page, limit });
    }
  } catch (error) {
    console.error("Error fetching content library:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
