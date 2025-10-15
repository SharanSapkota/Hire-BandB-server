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
exports.listPaymentMethods = listPaymentMethods;
exports.getPaymentMethod = getPaymentMethod;
exports.createPaymentMethod = createPaymentMethod;
exports.updatePaymentMethod = updatePaymentMethod;
exports.deletePaymentMethod = deletePaymentMethod;
exports.createPaymentTransaction = createPaymentTransaction;
exports.getPaymentTransaction = getPaymentTransaction;
exports.listPaymentTransactions = listPaymentTransactions;
const payRepo = __importStar(require("../repositories/paymentRepository"));
function listPaymentMethods() {
    return payRepo.findAllPaymentMethods();
}
function getPaymentMethod(id) {
    return payRepo.findPaymentMethodById(id);
}
function createPaymentMethod(data) {
    return payRepo.createPaymentMethod(data);
}
function updatePaymentMethod(id, data) {
    return payRepo.updatePaymentMethod(id, data);
}
function deletePaymentMethod(id) {
    return payRepo.deletePaymentMethod(id);
}
function createPaymentTransaction(data) {
    return payRepo.createPaymentTransaction(data);
}
function getPaymentTransaction(id) {
    return payRepo.findPaymentTransactionById(id);
}
function listPaymentTransactions() {
    return payRepo.listPaymentTransactions();
}
