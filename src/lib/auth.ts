import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
// In-memory user storage (for demo/local use only)
// In production, this would be a database
const VALID_USERS = [
  { id: "1", email: "admin@festivalcluster.org", password: "clusteradmin" },
  { id: "2", email: "bosca.music@gmail.com", password: "@unexcoder101" }
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        
        if (!credentials?.email || !credentials?.password) {
          return null
        }
         // Find user in memory
        const user = VALID_USERS.find(u => u.email === credentials.email)
        
        if (!user) return null
        
        // Simple password check (in production: use bcrypt)
        if (user.password !== credentials.password) {
          return null
        }

        // Return user object (password won't be exposed)
        return {
          id: user.id,
          email: user.email,
          name: user.email.split("@")[0]
        }
      }
    })
  ],
  pages: {
    signIn: "/login" // Custom login page
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    }
  }
})