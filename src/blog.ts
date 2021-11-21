interface BlogPost {
	id: number;
	date: number;
	author: string;
	title: string;
	content: string;
}

export const blogPosts: BlogPost[] = [
	{
		id: 1,
		date: Date.now(),
		author: "John Doe",
		title: "My first blog post",
		content: "This is my first blog post",
	},
	{
		id: 2,
		date: Date.now(),
		author: "Jane Doe",
		title: "My second blog post",
		content: "This is my second blog post",
	},
	{
		id: 3,
		date: Date.now(),
		author: "ThatAnonyG",
		title: "My third blog post",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
];
