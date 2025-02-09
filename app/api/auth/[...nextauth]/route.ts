import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        // Hardcoded admin credentials
        const adminEmail = "quizzitymc@canarychat.me"
        const adminPasswordHash = "$2a$12$y5o9apsgt0ctFcMnyA4EaejOz9XD/guHgoGQfoD2i.m/DpCCEGMem" // Replace with actual bcrypt hash of "ADSFilms"

        if (credentials.email !== adminEmail) {
          console.log("User not found")
          return null
        }

        const isPasswordValid = await compare(credentials.password, adminPasswordHash)

        if (!isPasswordValid) {
          console.log("Invalid password")
          return null
        }

        console.log("User authenticated:", adminEmail)
        return {
          id: "1",
          email: adminEmail,
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }

