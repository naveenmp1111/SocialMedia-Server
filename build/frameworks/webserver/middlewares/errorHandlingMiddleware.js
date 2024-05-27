"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlingMiddleware = (err, req, res, next) => {
    console.log('coming to errro handling middleware', err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};
exports.default = errorHandlingMiddleware;
