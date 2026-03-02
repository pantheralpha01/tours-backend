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
    role?: "ADMIN" | "AGENT" | "MANAGER";
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
};
