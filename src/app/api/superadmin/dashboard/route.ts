import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      studentsCount,
      tutorsCount,
      contentCount,
      judgementsCount,
      auditLogs,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.content.count(),
      prisma.judgement.count(),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return NextResponse.json({
      stats: {
        students: studentsCount,
        tutors: tutorsCount,
        content: contentCount,
        judgements: judgementsCount,
      },
      auditLogs,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
