import NextAuth, { AuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user || !user.password) return null

                const isValid = await compare(
                    credentials.password,
                    user.password
                )

                if (!isValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role, // ✅ Add role
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
