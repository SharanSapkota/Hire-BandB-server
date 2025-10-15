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
exports.list = list;
exports.get = get;
exports.create = create;
exports.update = update;
exports.remove = remove;
const prodService = __importStar(require("../services/productService"));
async function list(req, res) {
    const items = await prodService.listProducts();
    res.json(items);
}
async function get(req, res) {
    const id = Number(req.params.id);
    const item = await prodService.getProduct(id);
    if (!item)
        return res.status(404).json({ error: 'not found' });
    res.json(item);
}
async function create(req, res) {
    const ownerId = req.body.ownerId || req.user?.id;
    const item = await prodService.createProduct(req.body, ownerId);
    res.status(201).json(item);
}
async function update(req, res) {
    const id = Number(req.params.id);
    const updated = await prodService.updateProduct(id, req.body);
    res.json(updated);
}
async function remove(req, res) {
    const id = Number(req.params.id);
    await prodService.deleteProduct(id);
    res.json({ ok: true });
}
