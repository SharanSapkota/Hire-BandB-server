"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCategories = findAllCategories;
exports.findCategoryById = findCategoryById;
exports.createCategory = createCategory;
const prisma_1 = __importDefault(require("../prisma"));
function findAllCategories() {
    return prisma_1.default.category.findMany();
}
function findCategoryById(id) {
    return prisma_1.default.category.findUnique({ where: { id } });
}
function createCategory(data) {
    return prisma_1.default.category.create({ data });
}
