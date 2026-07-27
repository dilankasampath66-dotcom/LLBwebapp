import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const content = await prisma.content.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        isDeleted: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    });

    const judgements = await prisma.judgement.findMany({
      select: {
        id: true,
        title: true,
        isDeleted: true,
        createdAt: true,
      },
    });

    const csvRows = [
      ["ID", "Title", "Category", "Type", "Is Deleted", "Author", "Created At"],
      ...content.map((c) => [
        c.id,
        `"${c.title}"`,
        "Content",
        c.type,
        c.isDeleted,
        `"${c.author?.name || "Unknown"}"`,
        c.createdAt.toISOString(),
      ]),
      ...judgements.map((j) => [
        j.id,
        `"${j.title}"`,
        "Judgement",
        "N/A",
        j.isDeleted,
        "N/A",
        j.createdAt.toISOString(),
      ]),
    ];

    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="content-export.csv"`,
      },
    });
  } catch (error) {
    console.error("Export Content Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
