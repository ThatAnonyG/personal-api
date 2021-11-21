import { Document, Model, model, Schema } from "mongoose";

interface BlogPost extends Document {
	id: number;
	date: number;
	author: string;
	title: string;
	content: string;
}

const BlogPostSchema = new Schema<BlogPost>({
	id: { type: Number, required: true },
	date: { type: Number, required: true },
	author: { type: String, required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
});

const BlogPostModel = model<BlogPost, Model<BlogPost>>("posts", BlogPostSchema);

export { BlogPost, BlogPostSchema, BlogPostModel };
