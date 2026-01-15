import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth" // ถ้าใช้ next-auth

export async function POST(req: Request) {
    // Allow update without session if ID/Email is provided (for testing/development)
    // const session = await getServerSession() 
    // if (!session?.user?.email) { ... }

    try {
        const body = await req.json();
        const { id, name, username, email, image } = body;

        if (!id && !email) {
            return NextResponse.json({ error: "ID or Email required" }, { status: 400 });
        }

        const whereClause = id ? { id } : { email };

        const updatedUser = await prisma.user.update({
            where: whereClause,
            data: {
                name,
                username,
                // Only update email if it's not the search key, or just allow it 
                // (be careful updating the key you search by, but prisma handles it)
                email,
                image,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error: any) {
        console.error("Update error:", error);
        // Unique constraint failed
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "Username or Email already exists" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Update failed", details: error.message },
            { status: 500 }
        )
    }
}
