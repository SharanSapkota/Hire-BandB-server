"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllProductPrices = findAllProductPrices;
exports.createProductPrice = createProductPrice;
exports.findPriceById = findPriceById;
const prisma_1 = __importDefault(require("../prisma"));
function findAllProductPrices() {
    return prisma_1.default.productPrice.findMany();
}
function createProductPrice(data) {
    return prisma_1.default.productPrice.create({ data });
}
function findPriceById(id) {
    return prisma_1.default.productPrice.findUnique({ where: { id } });
}
