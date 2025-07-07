import { runDBOperation } from "@/lib/useDB"
import userSchema from "@/utils/schema/user-schema"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        console.log(credentials);

        // Find user by email
        const user = await runDBOperation(async() =>
          await userSchema.findOne({ email: credentials.email })
        );
        console.log(user);

        if (!user) {
          throw new Error("No user found with that email.");
        }

        // Check password
        const isValid = await bcrypt.compare(credentials?.password as string ?? "", user.password);
        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          username: user.username,
          image: user.image || null,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const isEmailVerified = profile?.email_verified;

        if (!isEmailVerified) {
          return false;
        }

        const userExists = await runDBOperation(async () => {
          const user = await userSchema.findOne({ email: profile?.email });
          return !!user;
        });

        if (!userExists) {
          await runDBOperation(async () => {
            const username = profile?.email?.split("@")[0]?.replace(/[._]/g, '').toLowerCase();
            const userData = new userSchema({
              email: profile?.email,
              fullName: profile?.name,
              username,
              image: profile?.picture,
              agreeToTerms: true,
              password: "fallback_hashed_password_here", // Ideally generate one or skip for OAuth-only users
            });
            await userData.save();
          });
        }

        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string | null;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
})