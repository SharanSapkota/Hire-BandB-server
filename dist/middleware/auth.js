"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
async function authenticate(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
        return res.status(401).json({ error: 'missing token' });
    const token = auth.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_1.default.user.findUnique({ where: { id: decoded.userId }, include: { role: true, type: true } });
        if (!user)
            return res.status(401).json({ error: 'invalid token' });
        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'invalid token' });
    }
}
function authorizeRoles(...allowed) {
    return (req, res, next) => {
        const roleName = req.user && req.user.role ? req.user.role.name : null;
        if (!roleName || !allowed.includes(roleName))
            return res.status(403).json({ error: 'forbidden' });
        next();
    };
}
