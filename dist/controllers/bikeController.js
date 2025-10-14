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
const bikeService = __importStar(require("../services/bikeService"));
async function list(req, res) {
    const bikes = await bikeService.listBikes();
    res.json(bikes);
}
async function get(req, res) {
    const id = Number(req.params.id);
    const bike = await bikeService.getBike(id);
    if (!bike)
        return res.status(404).json({ error: 'not found' });
    res.json(bike);
}
async function create(req, res) {
    try {
        const bike = await bikeService.createBike(req.body, req.user.id);
        res.status(201).json(bike);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal error' });
    }
}
async function update(req, res) {
    try {
        const id = Number(req.params.id);
        const updated = await bikeService.updateBike(id, req.body, req.user);
        res.json(updated);
    }
    catch (err) {
        if (err.message === 'not_found')
            return res.status(404).json({ error: 'not found' });
        if (err.message === 'forbidden')
            return res.status(403).json({ error: 'forbidden' });
        console.error(err);
        res.status(500).json({ error: 'internal error' });
    }
}
async function remove(req, res) {
    try {
        const id = Number(req.params.id);
        await bikeService.deleteBike(id, req.user);
        res.json({ ok: true });
    }
    catch (err) {
        if (err.message === 'not_found')
            return res.status(404).json({ error: 'not found' });
        if (err.message === 'forbidden')
            return res.status(403).json({ error: 'forbidden' });
        console.error(err);
        res.status(500).json({ error: 'internal error' });
    }
}
