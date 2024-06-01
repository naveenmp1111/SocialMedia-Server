"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryServiceInterface = void 0;
const cloudinaryServiceInterface = (service) => {
    const handleUpload = async (file) => service.handleUpload(file);
    return { handleUpload };
};
exports.cloudinaryServiceInterface = cloudinaryServiceInterface;
