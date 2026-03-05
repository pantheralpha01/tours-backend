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
            phone: data.phone,
            idNumber: data.idNumber,
            idType: data.idType,
            profilePicUrl: data.profilePicUrl,
            role: data.role ?? "AGENT",
        },
    }),
    findByEmail: (email) => prisma_1.prisma.user.findUnique({ where: { email } }),
    findById: (id) => prisma_1.prisma.user.findUnique({ where: { id } }),
    updatePassword: (id, hashedPassword) => prisma_1.prisma.user.update({ where: { id }, data: { password: hashedPassword } }),
    findByPhone: (phone) => {
        // Match regardless of stored format: 254..., +254..., 0...
        const normalized = phone.replace(/^\+/, ""); // strip leading +
        const withPlus = `+${normalized}`;
        const withZero = normalized.startsWith("254")
            ? `0${normalized.slice(3)}`
            : phone;
        return prisma_1.prisma.user.findFirst({
            where: { phone: { in: [normalized, withPlus, withZero] } },
        });
    },
};
//# sourceMappingURL=user.repository.js.map