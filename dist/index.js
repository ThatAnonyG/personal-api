"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
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
        blogPostNew: "/blog_post/new (POST)",
        blogPostDelete: "/blog_post/:id (DELETE)",
    });
});
app.get("/blog_posts", (req, res) => {
    blog_1.BlogPostModel.find({})
        .sort({ date: 1 })
        .lean()
        .exec()
        .then((docs) => {
        const posts = docs.map((_a) => {
            var { _id, __v } = _a, _ = __rest(_a, ["_id", "__v"]);
            return (Object.assign({}, _));
        });
        res.send({ posts });
    })
        .catch(console.error);
});
app.post("/blog_post/new", (req, res) => {
    const blogData = req.body;
    if (!blogData.title || !blogData.author || !blogData.content)
        return res.status(400).send({ error: "Invalid request body" });
    blog_1.BlogPostModel.find({})
        .sort({ id: -1 })
        .limit(1)
        .lean()
        .exec()
        .then((posts) => {
        const newPost = new blog_1.BlogPostModel(Object.assign({ id: posts ? posts[0].id + 1 : 1, date: Date.now() }, blogData));
        newPost
            .save()
            .then((doc) => {
            const _a = doc.toJSON(), { _id, __v } = _a, post = __rest(_a, ["_id", "__v"]);
            res.send({ post });
        })
            .catch(console.error);
    })
        .catch(console.error);
});
app.get("/blog_post/:id", (req, res) => {
    const blogIdStr = req.params.id;
    if (!blogIdStr || isNaN(parseInt(blogIdStr)))
        return res.status(400).send({ error: "Invalid ID" });
    const id = parseInt(blogIdStr);
    blog_1.BlogPostModel.findOne({ id })
        .lean()
        .exec()
        .then((doc) => {
        if (!doc)
            return res.status(404).send({ error: "Post not found" });
        const { _id, __v } = doc, post = __rest(doc, ["_id", "__v"]);
        res.send({ post });
    })
        .catch(console.error);
});
app.delete("/blog_post/:id", (req, res) => {
    const blogIdStr = req.params.id;
    if (!blogIdStr || isNaN(parseInt(blogIdStr)))
        return res.status(400).send({ error: "Invalid ID" });
    const id = parseInt(blogIdStr);
    blog_1.BlogPostModel.findOneAndDelete({ id })
        .lean()
        .exec()
        .then((post) => {
        if (!post)
            return res.status(404).send({ error: "Post not found" });
        res.send({ message: `Post with ID ${post.id} deleted` });
    })
        .catch(console.error);
});
(0, mongoose_1.connect)(process.env.MONGO_URI || "", (err) => {
    if (err)
        throw err;
    console.log(`Connected to database.`);
    app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
});
