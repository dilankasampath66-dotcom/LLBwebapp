import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/email";
import { authLimiter, getIpAddress } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const ip = getIpAddress(req);
    const rateLimit = authLimiter.check(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { message: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    const { fullName, email, phone, password, studyYear } = validatedData;

    // Check email uniqueness
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "Email is already registered." },
        { status: 409 }
      );
    }

    // Check phone uniqueness
    const existingUserByPhone = await db.user.findUnique({
      where: { phone },
    });

    if (existingUserByPhone) {
      return NextResponse.json(
        { message: "Phone number is already registered." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await db.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        studyYear,
        role: "STUDENT",
        emailVerified: false,
        verifyToken,
      },
    });

    await sendVerificationEmail(user.email, verifyToken);

    return NextResponse.json(
      { message: "Account created. Please verify your email." },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "A user with this email or phone already exists." },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
