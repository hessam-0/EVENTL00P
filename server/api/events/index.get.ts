import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";
import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  console.log("GET /api/events hit");

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

    console.log(`Successfully fetched ${events.length} events.`);
    return events;
  } catch (error) {
    console.error("Error fetching events: ", error);
    event.node.res.statusCode = 500;
    return {
      error: "Failed to fetch events. Unexpected internal server error.",
    };
  }
});
