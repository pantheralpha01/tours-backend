import { prisma } from "../../config/prisma";

export const userRepository = {
  create: (data: {
    name: string;
    email: string;
    password: string;
    role?: "ADMIN" | "AGENT" | "MANAGER";
  }) =>
    prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role ?? "AGENT",
      },
    }),

  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
};
