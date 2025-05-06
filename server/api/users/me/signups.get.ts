import { defineEventHandler, createError } from "h3";
import { getServerSession } from "#auth";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const userId = session.user.id;

  try {
    const signups = await prisma.eventSignUp.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startTime: true,
            location: true,
            description: true,
          },
        },
      },
      orderBy: {
        event: {
          startTime: "asc",
        },
      },
    });

    return signups;
  } catch (error) {
    console.error("Error fetching user signups:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
