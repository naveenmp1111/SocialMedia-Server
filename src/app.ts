import express, { Application } from 'express';
import expressConfig from './frameworks/webserver/express';
import http from 'http';
import serverConfig from './frameworks/webserver/server';
import connectDB from './frameworks/database/monogDB/connection';
import routes from './frameworks/webserver/routes';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandlingMiddleware';
import {Server} from 'socket.io'
import configKeys from './config';
import socketConfig from './frameworks/webSocket/socketConfig';

export const app: Application = express()
export const server = http.createServer(app)

//connecting mongodb
connectDB();

//socket.io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE"],
    }
})

socketConfig(io);

expressConfig(app)

routes(app)

app.use(errorHandlingMiddleware)

serverConfig(server).startServer()