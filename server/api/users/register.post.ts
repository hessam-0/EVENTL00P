import {
  defineEventHandler,
  readBody,
  createError,
  setResponseStatus,
} from "h3";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "~/server/utils/prisma";

const passwordValidationRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]).{8,}$/;
const passwordErrorMessage =
  "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";

const RegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordValidationRegex, { message: passwordErrorMessage }),
});

const saltRounds = 11;

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
    const validation = RegistrationSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request: Invalid registration data",
        data: validation.error.format(),
      });
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: "Conflict: Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    setResponseStatus(event, 201);
    return newUser;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Could not register user at this time.",
    });
  }
});
