import { prisma } from "../../config/prisma";

export const userRepository = {
  create: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    idNumber?: string;
    idType?: string;
    profilePicUrl?: string;
    role?: "ADMIN" | "AGENT" | "MANAGER" | "PARTNER";
  }) =>
    prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        idNumber: data.idNumber,
        idType: data.idType,
        profilePicUrl: data.profilePicUrl,
        role: data.role ?? "AGENT",
      },
    }),

  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  updatePassword: (id: string, hashedPassword: string) =>
    prisma.user.update({ where: { id }, data: { password: hashedPassword } }),

  findByPhone: (phone: string) => {
    // Match regardless of stored format: 254..., +254..., 0...
    const normalized = phone.replace(/^\+/, ""); // strip leading +
    const withPlus = `+${normalized}`;
    const withZero = normalized.startsWith("254")
      ? `0${normalized.slice(3)}`
      : phone;
    return prisma.user.findFirst({
      where: { phone: { in: [normalized, withPlus, withZero] } },
    });
  },
};
