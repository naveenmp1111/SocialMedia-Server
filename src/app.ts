import express, { Application } from 'express';
import expressConfig from './frameworks/webserver/express';
import http from 'http';
import serverConfig from './frameworks/webserver/server';
import connectDB from './frameworks/database/monogDB/connection';
import routes from './frameworks/webserver/routes';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandlingMiddleware';

export const app: Application = express()
export const server = http.createServer(app)

//connecting mongodb
connectDB();

expressConfig(app)

routes(app)

app.use(errorHandlingMiddleware)

serverConfig(server).startServer()