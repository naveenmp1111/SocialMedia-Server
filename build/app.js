"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = __importDefault(require("./frameworks/webserver/express"));
const http_1 = __importDefault(require("http"));
const server_1 = __importDefault(require("./frameworks/webserver/server"));
const connection_1 = __importDefault(require("./frameworks/database/monogDB/connection"));
const routes_1 = __importDefault(require("./frameworks/webserver/routes"));
const errorHandlingMiddleware_1 = __importDefault(require("./frameworks/webserver/middlewares/errorHandlingMiddleware"));
const socket_io_1 = require("socket.io");
const socketConfig_1 = __importDefault(require("./frameworks/webSocket/socketConfig"));
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
//connecting mongodb
(0, connection_1.default)();
//socket.io
exports.io = new socket_io_1.Server(exports.server, {
    pingTimeout: 60000,
    cors: {
        origin: true,
        // origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    }
});
(0, socketConfig_1.default)(exports.io);
(0, express_2.default)(exports.app);
(0, routes_1.default)(exports.app);
exports.app.use(errorHandlingMiddleware_1.default);
(0, server_1.default)(exports.server).startServer();
