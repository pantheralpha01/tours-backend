"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.userRepository = {
    create: (data) => prisma_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role ?? "AGENT",
        },
    }),
    findByEmail: (email) => prisma_1.prisma.user.findUnique({ where: { email } }),
    findById: (id) => prisma_1.prisma.user.findUnique({ where: { id } }),
};
//# sourceMappingURL=user.repository.js.map