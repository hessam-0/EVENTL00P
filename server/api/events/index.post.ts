import {
  defineEventHandler,
  readBody,
  createError,
  setResponseStatus,
} from "h3";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getServerSession } from "#auth";

import prisma from "~/server/utils/prisma";

const CreateEventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    description: z.string().trim(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    location: z.string().trim().optional(),
    imageUrl: z.string().url({ message: "Invalid URL format." }).optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to create events.",
    });
  }

  if ((session.user as { role?: string }).role !== "staff") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You do not have permission to perform this action.",
    });
  }

  const staffUserId = session.user.id;

  try {
    const requestBody = await readBody(event);
    const validatedData = CreateEventSchema.parse(requestBody);

    const newEvent = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        location: validatedData.location,
        imageUrl: validatedData.imageUrl,
        creatorId: staffUserId,
      },
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
    });

    setResponseStatus(event, 201);
    return { success: true, data: newEvent };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400, // Bad Request
        statusMessage: "Validation Error",
        message: "Invalid input data.",
        data: error.errors,
      });
    }
    // For now, a generic 500 error for unexpected issues.
    // In production, I would log `error` to a monitoring service.
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "An unexpected error occurred while creating the event.",
    });
  }
});
