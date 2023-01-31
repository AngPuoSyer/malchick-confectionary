import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (user && user.password === credentials?.password)
          return {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        return null;

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      },
    }),
  ],
  /**
   * ...add more providers here
   *
   * Most other providers require a bit more work than the Discord provider.
   * For example, the GitHub provider requires you to add the
   * `refresh_token_expires_in` field to the Account model. Refer to the
   * NextAuth.js docs for the provider you want to use. Example:
   * @see https://next-auth.js.org/providers/github
   */
};

export default NextAuth(authOptions);
