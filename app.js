"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = __importDefault(require("./frameworks/webserver/express"));
const http_1 = __importDefault(require("http"));
const server_1 = __importDefault(require("./frameworks/webserver/server"));
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
//connecting mongodb
// connectDB();
(0, express_2.default)(exports.app);
(0, server_1.default)(exports.server).startServer();
