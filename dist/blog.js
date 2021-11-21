"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostModel = exports.BlogPostSchema = void 0;
const mongoose_1 = require("mongoose");
const BlogPostSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    date: { type: Number, required: true },
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
});
exports.BlogPostSchema = BlogPostSchema;
const BlogPostModel = (0, mongoose_1.model)("posts", BlogPostSchema);
exports.BlogPostModel = BlogPostModel;
