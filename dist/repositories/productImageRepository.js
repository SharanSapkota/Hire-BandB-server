"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findImagesByProduct = findImagesByProduct;
exports.createProductImage = createProductImage;
exports.deleteProductImage = deleteProductImage;
const prisma_1 = __importDefault(require("../prisma"));
function findImagesByProduct(productId) {
    return prisma_1.default.productImage.findMany({ where: { productId } });
}
function createProductImage(data) {
    return prisma_1.default.productImage.create({ data });
}
function deleteProductImage(id) {
    return prisma_1.default.productImage.delete({ where: { id } });
}
