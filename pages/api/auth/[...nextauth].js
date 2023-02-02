import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodbconn";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token, user }) {
      session.user = { ...user };
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile: (profile, token) => {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.image,
          emailVerified: profile.emailVerified,
          admin: false,
          classcode: [],
          currentexam: {
            examid: "",
            starttime: 0,
            endtime: 0,
            questions: [],
          },
          exams: [],
        };
      },
    }),
  ],
});
