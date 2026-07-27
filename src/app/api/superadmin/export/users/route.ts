import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    const csvRows = [
      ["ID", "Name", "Email", "Role", "Is Active", "Created At"],
      ...users.map((u) => [
        u.id,
        `"${u.name}"`,
        u.email,
        u.role,
        u.isActive,
        u.createdAt.toISOString(),
      ]),
    ];

    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="users-export.csv"`,
      },
    });
  } catch (error) {
    console.error("Export Users Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
