import { defineEventHandler } from "h3";
import { getServerSession } from "#auth";
import { createError } from "h3";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - please log in to sign up for events",
    });
  }

  const eventId = event.context.params?.id;
  const userId = session.user.id;

  try {
    const signup = await prisma.eventSignUp.create({
      data: {
        eventId,
        userId,
      },
    });
    return { success: true, signup };
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation - already signed up
      return {
        success: true,
        message: "You are already signed up for this event",
      };
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Could not complete signup",
      data: error,
    });
  }
});
