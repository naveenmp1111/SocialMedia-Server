"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.default.CLOUDINARY_API_KEY,
    api_secret: config_1.default.CLOUDINARY_API_SECRET,
});
const cloudinaryService = () => {
    async function handleUpload(file) {
        const res = await cloudinary_1.v2.uploader.upload(file, {
            resource_type: "auto",
        });
        return res;
    }
    return { handleUpload };
};
exports.cloudinaryService = cloudinaryService;
