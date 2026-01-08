import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";


export async function POST(req: Request) {
    const { email, password } = await req.json();

    const existingUserByEmail = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!existingUserByEmail) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Set cookie
    (await cookies()).set("token", "login-success", {
        httpOnly: true,
        path: "/",
    });

    const isPasswordValid = await bcrypt.compare(password, existingUserByEmail.password);

    if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
