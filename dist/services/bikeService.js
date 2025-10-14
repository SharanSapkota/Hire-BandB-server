"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBikes = listBikes;
exports.getBike = getBike;
exports.createBike = createBike;
exports.updateBike = updateBike;
exports.deleteBike = deleteBike;
const bikeRepo = __importStar(require("../repositories/bikeRepository"));
const prisma_1 = __importDefault(require("../prisma"));
async function listBikes() {
    return bikeRepo.findAllBikes();
}
async function getBike(id) {
    return bikeRepo.findBikeById(id);
}
async function createBike(payload, ownerId) {
    const { name, description, rentAmount, status, startTime, endTime, categoryName } = payload;
    let category = null;
    if (categoryName) {
        category = await prisma_1.default.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } });
    }
    const data = {
        name,
        description,
        rentAmount: rentAmount != null ? Number(rentAmount) : 0,
        status,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        ownerId,
        categoryId: category ? category.id : undefined
    };
    return bikeRepo.createBike(data);
}
async function updateBike(id, payload, currentUser) {
    const bike = await bikeRepo.findBikeById(id);
    if (!bike)
        throw new Error('not_found');
    if (currentUser.id !== bike.ownerId && currentUser.role && currentUser.role.name !== 'ADMIN')
        throw new Error('forbidden');
    const { name, description, rentAmount, status, startTime, endTime, categoryName } = payload;
    let category = null;
    if (categoryName) {
        category = await prisma_1.default.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } });
    }
    const data = {
        name: name ?? bike.name,
        description: description ?? bike.description,
        rentAmount: rentAmount != null ? Number(rentAmount) : bike.rentAmount,
        status: status ?? bike.status,
        startTime: startTime ? new Date(startTime) : bike.startTime,
        endTime: endTime ? new Date(endTime) : bike.endTime,
        categoryId: category ? category.id : bike.categoryId
    };
    return bikeRepo.updateBike(id, data);
}
async function deleteBike(id, currentUser) {
    const bike = await bikeRepo.findBikeById(id);
    if (!bike)
        throw new Error('not_found');
    if (currentUser.id !== bike.ownerId && currentUser.role && currentUser.role.name !== 'ADMIN')
        throw new Error('forbidden');
    return bikeRepo.deleteBike(id);
}
