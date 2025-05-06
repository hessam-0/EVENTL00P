import {
  defineEventHandler,
  setResponseStatus,
  createError,
  H3Event,
} from "h3";
import { getServerSession } from "#auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event: H3Event) => {
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to delete an event.",
    });
  }
  if (session.user.role !== "staff") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You do not have permission to perform this action.",
    });
  }

  const eventId = event.context.params?.id;

  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Event ID is required.",
    });
  }
  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
    setResponseStatus(event, 204);
    return null;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: `Event with ID "${eventId}" not found.`,
      });
    }
    console.error("Error deleting event:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "An unexpected error occurred while deleting the event.",
    });
  }
});
