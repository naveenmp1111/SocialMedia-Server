"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const profile_1 = __importDefault(require("./profile"));
const admin_1 = __importDefault(require("./admin"));
const post_1 = __importDefault(require("./post"));
const user_1 = __importDefault(require("./user"));
const routes = (app) => {
    app.use('/api/auth', (0, auth_1.default)());
    app.use('/api/profile', (0, profile_1.default)());
    app.use('/api/admin', (0, admin_1.default)());
    app.use('/api/post', (0, post_1.default)());
    app.use('/api/user', (0, user_1.default)());
};
exports.default = routes;
