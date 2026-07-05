import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: 'Supervisor' | 'ACS' | 'Sales'
    } & DefaultSession["user"]
  }
}
