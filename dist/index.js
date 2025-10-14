"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const bikes_1 = __importDefault(require("./routes/bikes"));
const users_1 = __importDefault(require("./routes/users"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/bikes', bikes_1.default);
app.use('/api/users', users_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/notifications', notifications_1.default);
app.get('/', (req, res) => res.json({ ok: true }));
const port = process.env.PORT || 4000;
app.listen(Number(port), () => {
    console.log(`Server running on port ${port}`);
});
exports.default = app;
