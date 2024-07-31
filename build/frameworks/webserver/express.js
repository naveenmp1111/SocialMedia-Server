"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// app.use(cors());
const expressConfig = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // CORS options
    const corsOptions = {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        credentials: true // Allow credentials (cookies, authorization headers, etc.)
    };
    // CORS middleware
    app.use((0, cors_1.default)(corsOptions));
};
exports.default = expressConfig;
