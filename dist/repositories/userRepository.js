"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.findUserById = findUserById;
const prisma_1 = __importDefault(require("../prisma"));
async function findUserByEmail(email) {
    // email is stored in UserEmail
    return prisma_1.default.user.findFirst({ where: { emails: { some: { email } } }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
}
async function createUser(data) {
    const { email, roleId, ...rest } = data;
    const user = await prisma_1.default.user.create({ data: { ...rest, emails: email ? { create: { email, isPrimary: true } } : undefined } });
    if (roleId) {
        // create mapping in UserRole
        try {
            await prisma_1.default.userRole.create({ data: { userId: user.id, roleId: BigInt(roleId) } });
        }
        catch (e) {
            // swallow mapping error to not break user creation if role mapping fails
            console.warn('Failed to create user role mapping', e);
        }
    }
    return user;
}
async function findUserById(id) {
    return prisma_1.default.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } }, UserType: true, emails: true } });
}
