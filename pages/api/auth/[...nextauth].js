import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const adminEmail = ['ali.nourikhah@gmail.com'];

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmail.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmail.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'Not an admin!';
  }
}
