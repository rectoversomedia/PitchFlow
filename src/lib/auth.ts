import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/server"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Demo Login",
      credentials: {
        type: { label: "type", type: "text" },
        email: { label: "email", type: "text" },
      },
      async authorize(credentials) {
        // Demo user simulation
        if (credentials?.type === "demo") {
          return {
            id: "demo-1",
            name: "Demo User",
            email: "demo@pitchflow.app",
          }
        }
        if (credentials?.type === "existing" && credentials?.email) {
          return {
            id: "user-1",
            name: "Fajar Pahlawan H.",
            email: credentials.email as string,
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, try to create/fetch user from Supabase
      if (account?.provider === "google" && user.email) {
        try {
          const supabase = await createClient()

          // Check if user exists
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single()

          if (!existingUser) {
            // Create new user
            await supabase.from("users").insert({
              id: user.id!,
              name: user.name || user.email.split("@")[0],
              email: user.email,
              role: "Sales", // Default role
              avatar_url: user.image,
            })
          }
        } catch (error) {
          console.error("Supabase sync error:", error)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
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
  },
})
