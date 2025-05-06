import { defineEventHandler } from "h3";
import { getServerSession } from "#auth";
import { createError } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - please log in to manage event signups",
    });
  }

  const eventId = event.context.params?.id;
  const userId = session.user.id;

  try {
    await prisma.eventSignUp.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });
    return { success: true, message: "Successfully unsubscribed from event" };
  } catch (error) {
    if (error.code === "P2025") {
      // Record not found - already not signed up
      return {
        success: true,
        message: "You were not signed up for this event",
      };
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Could not complete unsubscribe",
      data: error,
    });
  }
});
