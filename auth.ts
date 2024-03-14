import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "@/data/user"

import { db } from "@/lib/db"
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
    pages: {
      signIn: "/auth/login",
      error: "/auth/login",
    },
    events: {
      async linkAccount({ user }) {
        await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
        })
      }
    },
    callbacks: {
      async signIn({ user, account }) {
        // Allow OAuth without email verification
        if (account?.provider !== "credentials") return true;

        const existingUser = await getUserById(user?.id || '');

        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;

        // TODO: Add 2FA Check

        return true;
      },

      async session ({ token, session }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }

        if (token.role && session.user) {
          session.user.role = token.role as "ADMIN" | "USER";
        }

        return session;
      },
      async jwt ({ token }) {
        if (!token.sub) return token;

        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;
        token.role = existingUser.role;
        return token;
      }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
});