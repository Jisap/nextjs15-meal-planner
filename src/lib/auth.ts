import db from "@/lib/db";
import { comparePassword, toNumberSafe, toStringSafe } from "@/lib/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { signInSchema } from "@/app/(auth)/sign-in/_types/signinSchema"
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    name?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string | null;
    role?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { // Campos
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const validatedCredentials = signInSchema.parse(credentials);  // Validación de los campos con signInSchema

        const user = await db.user.findUnique({                        // Busca el usuario en bd
          where: {
            email: validatedCredentials.email,
          },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await comparePassword(                 // Si el usuario existe, se compara la contraseña introducida con la contraseña cifrada (hashed) de la base de datos usando bcrypt.
          validatedCredentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {                                                        // Si todo es correcto devuelve el usuario
          id: toStringSafe(user.id),
          email: user.email,
          name: user.name,
          role: user.role, // por defecto el rol es user
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    jwt({ token, user }) {                                       // Despues de hacer signIn exitoso se llama a jwt -> crea un token con el user y el role -> cookie en el navegador
      const clonedToken = token;
      if (user) {
        clonedToken.id = toNumberSafe(user.id);
        clonedToken.name = user?.name;
        clonedToken.role = user?.role;
      }
      return clonedToken;
    },
    session({ session, token }) {                                // Cada vez que la aplicación necesite acceder a los datos de la session se llama a session 
      const clonedSession = session;                             // session de next-auth creará un objeto session que incorporá los datos del user almacenados en la cookie a traves de un token jwt           

      if (clonedSession.user) {
        clonedSession.user.id = toStringSafe(token.id);
        clonedSession.user.name = token.name;
        clonedSession.user.role = token.role;
      }

      return clonedSession;
    },
  },
});