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
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, create user in Supabase if not exists
      if (account?.provider === "google" && user.email) {
        try {
          const supabase = await createClient()

          // Check if user exists in users table
          const { data: existingUser } = await supabase
            .from("users")
            .select("id, role")
            .eq("email", user.email)
            .single()

          if (!existingUser) {
            // Create new user with default role
            const { data: newUser, error } = await supabase
              .from("users")
              .insert({
                id: user.id!,
                name: user.name || user.email.split("@")[0],
                email: user.email,
                role: "Sales", // Default role for new users
                avatar_url: user.image,
              })
              .select("id, role")
              .single()

            if (error) {
              console.error("Error creating user:", error)
            } else {
              console.log("New user created:", newUser)
            }
          } else {
            console.log("Existing user:", existingUser)
          }
        } catch (error) {
          console.error("Supabase sync error:", error)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
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
