"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const blog_1 = require("./blog");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send({
        blogPosts: "/blog_posts",
        blogPostWithId: "/blog_post/:id",
    });
});
app.get("/blog_posts", (req, res) => {
    res.send({ posts: blog_1.blogPosts });
});
app.get("/blog_posts/:id", (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id)))
        return res.status(400).send({ error: "Invalid ID" });
    const post = blog_1.blogPosts.find((x) => x.id === parseInt(id));
    if (!post)
        return res.status(404).send({ error: "Post not found" });
    res.send({ post });
});
app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT}`));
