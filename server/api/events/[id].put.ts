import { defineEventHandler, readBody, createError, H3Event } from "h3";
import { getServerSession } from "#auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import prisma from "~/server/utils/prisma";

const UpdateEventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string(),
    startTime: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message:
          issue.code === z.ZodIssueCode.invalid_date
            ? "Start date and time are required"
            : defaultError,
      }),
    }),
    endTime: z.coerce.date(),
    location: z.string(),
  })
  .refine((data) => !data.endTime || data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export default defineEventHandler(async (event: H3Event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to update an event.",
    });
  }
  if (session.user.role !== "staff") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You do not have permission to perform this action.",
    });
  }
  const staffId = session.user.id;
  const eventId = event.context.params?.id;
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Event ID is required in the URL path.",
    });
  }

  const body = await readBody(event);
  const validationResult = UpdateEventSchema.safeParse(body);

  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid event data.",
      data: validationResult.error.errors,
    });
  }

  const validatedData = validationResult.data;

  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...validatedData,
      },
    });

    return updatedEvent;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: `Event with ID "${eventId}" not found or you don't have permission to update it.`,
      });
    }

    console.error("Error updating event:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "An unexpected error occurred while updating the event.",
    });
  }
});
