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
Object.defineProperty(exports, "__esModule", { value: true });
exports.listImages = listImages;
exports.createImage = createImage;
exports.createPrice = createPrice;
exports.listPrices = listPrices;
exports.createAssigned = createAssigned;
exports.listAssigned = listAssigned;
const assetService = __importStar(require("../services/productAssetService"));
async function listImages(req, res) {
    const productId = Number(req.params.productId);
    const items = await assetService.listImages(productId);
    res.json(items);
}
async function createImage(req, res) {
    const data = { ...(req.body || {}) };
    const item = await assetService.createImage(data);
    res.status(201).json(item);
}
async function createPrice(req, res) {
    const item = await assetService.createPrice(req.body);
    res.status(201).json(item);
}
async function listPrices(req, res) {
    const items = await assetService.listPrices();
    res.json(items);
}
async function createAssigned(req, res) {
    const item = await assetService.createAssigned(req.body);
    res.status(201).json(item);
}
async function listAssigned(req, res) {
    const ownerId = Number(req.params.ownerId || req.user?.id);
    const items = await assetService.listAssigned(ownerId);
    res.json(items);
}
