import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const saltRounds = 11; // bcrypt salt rounds

async function main() {
  console.log("Starting seeding process...");

  // --- Define Staff User Seed Data ---
  const staffEmail = "admin@eventloop.com";
  const staffPassword = "password123"; // Use a secure password in reality

  console.log(`Hashing password for staff user: ${staffEmail}...`);
  const staffHashedPassword = await bcrypt.hash(staffPassword, saltRounds);
  console.log("Staff password hashed.");

  console.log(`Upserting staff user: ${staffEmail}`);
  const staffUser = await prisma.user.upsert({
    where: { email: staffEmail },
    update: {
      passwordHash: staffHashedPassword,
      role: "staff",
      name: "Admin User",
    },
    create: {
      email: staffEmail,
      passwordHash: staffHashedPassword,
      name: "Admin User",
      role: "staff",
    },
  });
  console.log(
    `Successfully upserted staff user: ${staffUser.email} (ID: ${staffUser.id}, Role: ${staffUser.role})`
  );

  // --- Define Regular User Seed Data ---
  const regularUserEmail = "user@example.com";
  const regularUserPassword = "password456"; // Use a secure password in reality

  console.log(`Hashing password for regular user: ${regularUserEmail}...`);
  const regularUserHashedPassword = await bcrypt.hash(
    regularUserPassword,
    saltRounds
  );
  console.log("Regular user password hashed.");

  console.log(`Upserting regular user: ${regularUserEmail}`);
  const regularUser = await prisma.user.upsert({
    where: { email: regularUserEmail },
    update: {
      passwordHash: regularUserHashedPassword,
      role: "user",
      name: "Regular User",
    },
    create: {
      email: regularUserEmail,
      passwordHash: regularUserHashedPassword,
      name: "Regular User",
      role: "user",
    },
  });
  console.log(
    `Successfully upserted regular user: ${regularUser.email} (ID: ${regularUser.id}, Role: ${regularUser.role})`
  );

  // --- Seed Tech/Networking Events ---
  if (staffUser) {
    console.log(`Starting to seed events, created by ${staffUser.email}...`);
    const techEventsData = [
      {
        title: "Nuxt Nation Conference Warm-up",
        description:
          "Pre-conference mixer for Nuxt.js enthusiasts. Chat about the latest features and network with fellow developers. Drinks and snacks on us!",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3), // 3 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 3 + 3 * 60 * 60 * 1000
        ), // 3 hours duration
        location: "Tech Hub Downtown, Mixer Lounge",
      },
      {
        title: "TypeScript Tuesdays: Advanced Types",
        description:
          "Monthly deep-dive into TypeScript. This session covers conditional types, mapped types, and utility types. Bring your tough questions!",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), // 5 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 5 + 2 * 60 * 60 * 1000
        ), // 2 hours duration
        location: "Online via Zoom (Link in description after sign-up)",
      },
      {
        title: "PostgreSQL Performance Tuning Workshop",
        description:
          "Learn how to optimize your PostgreSQL queries, understand execution plans, and configure your database for peak performance. Led by a DB admin.",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 8), // 8 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 8 + 4 * 60 * 60 * 1000
        ), // 4 hours duration
        location: "CodeSpace Collective, Room A",
      },
      {
        title: "Vue.js Virtuosos: State Management Showdown",
        description:
          "Comparing Pinia, Vuex, and other state management solutions in Vue 3. Live coding and interactive Q&A.",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 12), // 12 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 12 + 2.5 * 60 * 60 * 1000
        ), // 2.5 hours duration
        location: "DevConnect Hall, Main Stage",
      },
      {
        title: "Freelancer Forge: Finding Your Niche",
        description:
          "A networking event for freelance developers. Discuss strategies for marketing, client acquisition, and specializing your services. Peer-led discussions.",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 15), // 15 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 15 + 2 * 60 * 60 * 1000
        ), // 2 hours duration
        location: "The Indie Coder Cafe",
      },
      {
        title: "API Design Best Practices with Nitro",
        description:
          "Explore how to build robust and scalable APIs using Nuxt 3's Nitro server engine. Covering RESTful principles, error handling, and middleware.",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 18), // 18 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 18 + 3 * 60 * 60 * 1000
        ), // 3 hours duration
        location: "Online - Webinar Series",
      },
      {
        title: "Intro to Prisma: ORM Powerhouse",
        description:
          "New to Prisma? This introductory session covers schema design, migrations, and basic CRUD operations. Perfect for backend developers.",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 22), // 22 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 22 + 2 * 60 * 60 * 1000
        ), // 2 hours duration
        location: "University Tech Block, Lecture Hall 3",
      },
      {
        title: "Git Gud: Advanced Version Control",
        description:
          "Take your Git skills beyond commits and pushes. Interactive session on rebasing, cherry-picking, submodules, and Git workflows.",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 25), // 25 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 25 + 3 * 60 * 60 * 1000
        ), // 3 hours duration
        location: "Startup Incubator Hub, Workshop Room",
      },
      {
        title: "DevOps Discussions: CI/CD for Frontend",
        description:
          "Monthly roundtable on DevOps topics. This month: setting up effective CI/CD pipelines for modern frontend applications using Vercel, GitHub Actions, etc.",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 * 30), // 30 days from now
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 30 + 2 * 60 * 60 * 1000
        ), // 2 hours duration
        location: "The Byte Bar - Back Room",
      },
    ];

    let eventsCreatedCount = 0;
    for (const eventData of techEventsData) {
      // Destructure the eventData to separate fields for Event model
      // from any potential extra fields you might have in techEventsData
      const { title, description, startTime, endTime, location } = eventData;

      await prisma.event.create({
        data: {
          title,
          description,
          startTime,
          endTime,
          location,
          creator: {
            // Use the 'creator' relation field
            connect: {
              // Connect to the existing staffUser
              id: staffUser.id,
            },
          },
        },
      });
      eventsCreatedCount++;
    }
    console.log(`Successfully seeded ${eventsCreatedCount} tech events.`);
  } else {
    console.warn("Staff user not found, skipping event seeding.");
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("Error during seeding: ", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma Client...");
    await prisma.$disconnect();
    console.log("Prisma Client disconnected.");
  });
