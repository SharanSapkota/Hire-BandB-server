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
exports.listServices = listServices;
exports.createService = createService;
exports.createIdentity = createIdentity;
exports.listIdentities = listIdentities;
const idService = __importStar(require("../services/identificationService"));
async function listServices(req, res) {
    const items = await idService.listServices();
    res.json(items);
}
async function createService(req, res) {
    const item = await idService.createService(req.body);
    res.status(201).json(item);
}
async function createIdentity(req, res) {
    const data = { ...(req.body || {}), userId: Number(req.params.userId || req.user?.id) };
    const item = await idService.createIdentity(data);
    res.status(201).json(item);
}
async function listIdentities(req, res) {
    const userId = Number(req.params.userId || req.user?.id);
    const items = await idService.listIdentities(userId);
    res.json(items);
}
