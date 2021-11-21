import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { blogPosts } from "./blog";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
	res.send({
		blogPosts: "/blog_posts",
		blogPostWithId: "/blog_post/:id",
	});
});

app.get("/blog_posts", (req, res) => {
	res.send({ posts: blogPosts });
});

app.get("/blog_posts/:id", (req, res) => {
	const { id } = req.params;
	if (!id || isNaN(parseInt(id)))
		return res.status(400).send({ error: "Invalid ID" });

	const post = blogPosts.find((x) => x.id === parseInt(id));
	if (!post) return res.status(404).send({ error: "Post not found" });

	res.send({ post });
});

app.listen(process.env.PORT, () =>
	console.log(`Listening on port ${process.env.PORT}`)
);
