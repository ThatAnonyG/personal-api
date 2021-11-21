import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "mongoose";

import { BlogPostModel } from "./blog";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
	res.send({
		blogPosts: "/blog_posts",
		blogPostWithId: "/blog_post/:id",
		blogPostNew: "/blog_post/new (POST)",
		blogPostDelete: "/blog_post/:id (DELETE)",
	});
});

app.get("/blog_posts", (req, res) => {
	BlogPostModel.find({})
		.sort({ date: 1 })
		.lean()
		.exec()
		.then((docs) => {
			const posts = docs.map(({ _id, __v, ..._ }) => ({ ..._ }));
			res.send({ posts });
		})
		.catch(console.error);
});

app.post("/blog_post/new", (req, res) => {
	const blogData: { author: string; title: string; content: string } = req.body;
	if (!blogData.title || !blogData.author || !blogData.content)
		return res.status(400).send({ error: "Invalid request body" });

	BlogPostModel.find({})
		.sort({ id: -1 })
		.limit(1)
		.lean()
		.exec()
		.then((posts) => {
			const newPost = new BlogPostModel({
				id: posts ? posts[0].id + 1 : 1,
				date: Date.now(),
				...blogData,
			});
			newPost
				.save()
				.then((doc) => {
					const { _id, __v, ...post } = doc.toJSON();
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

	BlogPostModel.findOne({ id })
		.lean()
		.exec()
		.then((doc) => {
			if (!doc) return res.status(404).send({ error: "Post not found" });
			const { _id, __v, ...post } = doc;
			res.send({ post });
		})
		.catch(console.error);
});

app.delete("/blog_post/:id", (req, res) => {
	const blogIdStr = req.params.id;
	if (!blogIdStr || isNaN(parseInt(blogIdStr)))
		return res.status(400).send({ error: "Invalid ID" });

	const id = parseInt(blogIdStr);

	BlogPostModel.findOneAndDelete({ id })
		.lean()
		.exec()
		.then((post) => {
			if (!post) return res.status(404).send({ error: "Post not found" });
			res.send({ message: `Post with ID ${post.id} deleted` });
		})
		.catch(console.error);
});

connect(process.env.MONGO_URI || "", (err) => {
	if (err) throw err;
	console.log(`Connected to database.`);
	app.listen(process.env.PORT, () =>
		console.log(`Listening on port ${process.env.PORT}...`)
	);
});
