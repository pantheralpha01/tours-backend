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
  const existingPartner = await prisma.partner.findUnique({
    where: { email: partnerEmail },
  });

  if (!existingPartner) {
    await prisma.partner.create({
      data: {
        name: "Sample Travel Partner",
        email: partnerEmail,
        phone: "+254712345678",
        isActive: true,
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
