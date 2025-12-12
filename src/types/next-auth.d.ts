import { DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      twoFactorEnabled: boolean
    } & DefaultSession["user"]
    twoFactorVerified: boolean
  }

  interface User {
    role: UserRole
    twoFactorEnabled: boolean
  }
}
