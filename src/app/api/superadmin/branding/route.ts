import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          headline: "OUSL Law Student Portal",
          subtext: "Empowering legal education",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("SiteSettings GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json();
    let settings = await prisma.siteSettings.findFirst();

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data,
      });
    } else {
      settings = await prisma.siteSettings.create({
        data,
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("SiteSettings PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
