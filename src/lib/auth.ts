import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/server"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const supabase = await createClient()

          // Find user by email
          const { data: user, error } = await supabase
            .from("users")
            .select("id, email, name, role, avatar_url, password_hash")
            .eq("email", email)
            .single()

          if (error || !user) {
            console.error("User not found:", error)
            return null
          }

          // Verify password if password_hash exists
          if (user.password_hash) {
            const bcrypt = await import('bcryptjs')
            const isValid = await bcrypt.compare(password, user.password_hash)
            if (!isValid) {
              console.error("Invalid password")
              return null
            }
          } else {
            // For users without password hash (OAuth users), reject credentials login
            console.error("User does not have password set")
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        ;(session.user as any).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
})
