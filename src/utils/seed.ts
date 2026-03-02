import { prisma } from "../config/prisma";
import { hashPassword } from "./password";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword("Admin@123");
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists");
  }

  // Create sample partner
  const partnerEmail = "partner@example.com";
  const existingUser = await prisma.user.findUnique({
    where: { email: partnerEmail },
  });

  if (!existingUser) {
    const hashedPassword = await hashPassword("Partner@123");
    const user = await prisma.user.create({
      data: {
        name: "Sample Partner",
        email: partnerEmail,
        password: hashedPassword,
        phone: "+254712345678",
        role: "PARTNER",
        isActive: true,
      },
    });

    await prisma.partner.create({
      data: {
        userId: user.id,
        businessName: "Sample Partner Business",
        description: "A sample partner for testing",
        isActive: true,
        approvalStatus: "APPROVED",
        serviceCategories: ["GET_AROUND"],
        getAroundServices: ["AIRPORT_TRANSFERS"],
      },
    });
    console.log("Sample partner created");
  } else {
    console.log("Sample partner already exists");
  }

  console.log("Seeding completed");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
