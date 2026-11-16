import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Invalid credentials");
          }

          const user = await res.json();
          return {
            id: user._id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role || "user",
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
          };
        } catch (error) {
          // Authorization error
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user && account?.provider === "credentials") {
        return {
          ...token,
          id: user.id,
          role: (user as { role?: string }).role || "user",
          first_name: (user as { first_name?: string }).first_name,
          last_name: (user as { last_name?: string }).last_name,
          phone: (user as { phone?: string }).phone,
        };
      }

      if (user && account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              first_name: user.name?.split(" ")[0] || "Google",
              last_name: user.name?.split(" ").slice(1).join(" ") || "User",
              googleId: account.providerAccountId,
            }),
          });

          if (res.ok) {
            const backendUser = await res.json();
            return {
              ...token,
              id: backendUser._id,
              role: backendUser.role || "user",
              first_name: backendUser.first_name,
              last_name: backendUser.last_name,
              phone: backendUser.phone,
            };
          }
        } catch (error) {
          // Error syncing Google user
        }

        return {
          ...token,
          id: user.id,
          role: "user",
          first_name: user.name?.split(" ")[0] || "Google",
          last_name: user.name?.split(" ").slice(1).join(" ") || "User",
          phone: "",
        };
      }

      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          first_name: token.first_name as string,
          last_name: token.last_name as string,
          phone: token.phone as string,
        },
      };
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
