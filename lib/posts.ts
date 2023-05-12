import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import rehypeSlug from "rehype-slug";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as {
        updated_date: string;
        title: string;
        visited_date: string;
      }),
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.updated_date < b.updated_date) {
      return 1;
    }
    if (a.updated_date > b.updated_date) {
      return -1;
    }
    if (a.visited_date < b.visited_date) {
      return 1;
    }
    return -1;
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as {
      updated_date: string;
      title: string;
      visited_date: string;
    }),
  };
}
