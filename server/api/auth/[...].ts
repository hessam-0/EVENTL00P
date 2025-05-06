import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "~/server/utils/prisma";
import bcrypt from "bcrypt";

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  //secret: useRuntimeConfig().authSecret,

  session: {
    strategy: "jwt",
  },

  providers: [
    // @ts-expect-error Need .default for SSR
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "staff@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // console.log(
        //   "Authorize function called with credentials: ",
        //   credentials
        // );

        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password in credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.log(`No staff user found with email: ${credentials.email}`);
            return null;
          }

          if (!user.passwordHash) {
            console.error(
              `User ${credentials.email} has no password hash set.`
            );
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (isPasswordValid) {
            // const { passwordHash, ...userWithoutPassword } = user;
            // console.log("Authorize returning: ", {
            //   id: user.id,
            //   email: user.email,
            //   name: user.name,
            //   image: user.image,
            //   role: user.role,
            // });
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
            }; // login success
          } else {
            console.log(`Password invalid.`);
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // jwt callback: Called when JWT is created/updated.
    // `user` parameter is only passed on sign-in.
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token; // Return the token with the added id
    },

    // session callback: Called when session is accessed.
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
