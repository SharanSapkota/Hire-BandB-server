"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllProducts = findAllProducts;
exports.findProductById = findProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = __importDefault(require("../prisma"));
function findAllProducts() {
    return prisma_1.default.product.findMany({ include: { productPrice: true, images: true, ProductAssigned: true } });
}
function findProductById(id) {
    return prisma_1.default.product.findUnique({ where: { id }, include: { productPrice: true, images: true, ProductAssigned: true } });
}
function createProduct(data) {
    return prisma_1.default.product.create({ data, include: { productPrice: true, images: true, ProductAssigned: true } });
}
function updateProduct(id, data) {
    return prisma_1.default.product.update({ where: { id }, data, include: { productPrice: true, images: true, ProductAssigned: true } });
}
function deleteProduct(id) {
    return prisma_1.default.product.delete({ where: { id } });
}
