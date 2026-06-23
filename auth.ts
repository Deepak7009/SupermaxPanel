import NextAuth, { Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

import connectToDatabase from "@/lib/mongodb";
import Admin from "@/app/admin/models/Admin";

const authConfig = {
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>
      ) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();

        const admin = await Admin.findOne({
          email: credentials.email as string,
        });

        if (!admin) {
          return null;
        }

        const isMatch = await admin.comparePassword(
          credentials.password as string
        );

        if (!isMatch) {
          return null;
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          role: "admin",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User;
    }) {
      if (user?.role) {
        token.role = user.role;
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      session.user.role = token.role;

      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },

  trustHost: true,
  secret: process.env.AUTH_SECRET,
};

const nextAuth = NextAuth(authConfig);

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;