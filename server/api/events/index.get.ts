import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";
import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startTime: "asc",
      },
      include: {
        creator: {
          select: {
            // email: true,
            name: true,
          },
        },
      },
    });

    return events;
  } catch (error) {
    event.node.res.statusCode = 500;
    return {
      error: "Failed to fetch events. Unexpected internal server error.",
    };
  }
});
