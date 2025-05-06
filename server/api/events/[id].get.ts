import { defineEventHandler, getRouterParam, createError } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request: Missing event ID",
    });
  }
  try {
    const eventDetails = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        creator: {
          select: { name: true },
        },
      },
    });
    if (!eventDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: `Not Found: Event with ID '${eventId}' not found.`,
      });
    }
    return eventDetails;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
    ) {
      throw error;
    } else {
      console.error(`Unexpected error fetching event ${eventId}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error: Could not fetch event details.",
      });
    }
  }
});
