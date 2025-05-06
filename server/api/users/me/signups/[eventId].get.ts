import { defineEventHandler, createError } from "h3";
import { getServerSession } from "#auth";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    return { isSignedUp: false };
  }

  const eventId = event.context.params?.eventId;
  const userId = session.user.id;

  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: "Event ID required",
    });
  }

  try {
    const existingSignup = await prisma.eventSignUp.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      select: { id: true },
    });
    return { isSignedUp: !!existingSignup };
  } catch (error) {
    console.error("Error checking signup status:", error);
    throw createError({
      statusCode: 500,
      message: "Could not check signup status",
    });
  }
});
