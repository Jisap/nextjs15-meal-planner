"use server";

import {
  signUpSchema,
  SignUpSchema,
} from "@/app/(auth)/sign-up/_types/signUpSchema";
import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { hashPassword } from "@/lib/utils";

const signUp = async (data: SignUpSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = signUpSchema.parse(data);                       // Valida el esquema
      const hashedPassword = await hashPassword(validatedData.password);    // Hashea la contraseña

      await db.user.create({                                                // Crea el usuario en bd
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
        },
      });

    },
  });
};

export { signUp };