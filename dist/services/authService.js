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
exports.signup = signup;
exports.login = login;
const userRepo = __importStar(require("../repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
async function signup(payload) {
    const existing = await userRepo.findUserByEmail(payload.email);
    if (existing)
        throw new Error('email_in_use');
    const hashed = await bcrypt_1.default.hash(payload.password, 10);
    // default role/type lookup
    const defaultRole = await (await Promise.resolve().then(() => __importStar(require('../prisma')))).default.userRole.findFirst({ where: { name: 'USER' } });
    const defaultType = await (await Promise.resolve().then(() => __importStar(require('../prisma')))).default.userType.findFirst({ where: { name: 'CUSTOMER' } });
    const user = await userRepo.createUser({ email: payload.email, password: hashed, name: payload.name, roleId: defaultRole ? defaultRole.id : undefined, typeId: defaultType ? defaultType.id : undefined });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: defaultRole ? defaultRole.name : 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
}
async function login(payload) {
    const user = await userRepo.findUserByEmail(payload.email);
    if (!user)
        throw new Error('invalid_credentials');
    const ok = await bcrypt_1.default.compare(payload.password, user.password);
    if (!ok)
        throw new Error('invalid_credentials');
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role ? user.role.name : 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
}
