"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listIdentificationServices = listIdentificationServices;
exports.createIdentificationService = createIdentificationService;
exports.createUserIdentity = createUserIdentity;
exports.listUserIdentities = listUserIdentities;
const prisma_1 = __importDefault(require("../prisma"));
function listIdentificationServices() {
    return prisma_1.default.identificationService.findMany();
}
function createIdentificationService(data) {
    return prisma_1.default.identificationService.create({ data });
}
function createUserIdentity(data) {
    return prisma_1.default.userIdentity.create({ data });
}
function listUserIdentities(userId) {
    return prisma_1.default.userIdentity.findMany({ where: { userId } });
}
