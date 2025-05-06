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
    // <-- Changed from prisma.staff to prisma.user
    where: { email: staffEmail },
    update: {
      passwordHash: staffHashedPassword,
      role: "staff", // Ensure role is set on update
      name: "Admin User",
    },
    create: {
      email: staffEmail,
      passwordHash: staffHashedPassword,
      name: "Admin User",
      role: "staff", // <-- Set the role to 'staff' on creation
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
    // <-- Use prisma.user
    where: { email: regularUserEmail },
    update: {
      passwordHash: regularUserHashedPassword,
      role: "user", // Ensure role is set on update
      name: "Regular User",
    },
    create: {
      email: regularUserEmail,
      passwordHash: regularUserHashedPassword,
      name: "Regular User",
      role: "user", // <-- Set the role to 'user' on creation
    },
  });
  console.log(
    `Successfully upserted regular user: ${regularUser.email} (ID: ${regularUser.id}, Role: ${regularUser.role})`
  );

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
