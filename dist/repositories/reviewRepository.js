"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReviewsByProduct = findReviewsByProduct;
exports.createReview = createReview;
const prisma_1 = __importDefault(require("../prisma"));
function findReviewsByProduct(productId) {
    return prisma_1.default.review.findMany({ where: { productId } });
}
function createReview(data) {
    return prisma_1.default.review.create({ data });
}
