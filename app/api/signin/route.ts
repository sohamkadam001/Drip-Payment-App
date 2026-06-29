import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server"; // Import Next.js specific response
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {

            return NextResponse.json(
                { message: "User does not exist" },
                { status: 404 }
            );
        }

        const matchpass = await bcrypt.compare(password, user.password);

        if (!matchpass) {
            // FIXED: Added a 401 (Unauthorized) status
            return NextResponse.json(
                { message: "Invalid Credentials" },
                { status: 401 }
            );
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET as string);

        return NextResponse.json({
            token,
            username: user.username
        }, { status: 200 });

    } catch (error) {
        console.error("Sign in error:", error);
        // Catch any database drops or JSON parsing errors
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}