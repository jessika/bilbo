/**
 * @fileoverview Functions that help with getting post data.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";

const postsDirectory = path.join(process.cwd(), "posts");

export interface PostMetadata {
  id: string;
  updated_date: string;
  title: string;
  thumbnail: string;
  visited_date: string;
}

export interface PostData {
  mdxSource: MDXRemoteSerializeResult;
  id: string;
  updated_date: string;
  title: string;
  visited_date: string;
}

export function getSortedPostMetadatas(): PostMetadata[] {
  const allPostsData = getPostFileNames().map((fileName) => {
    const id = getSlugFromFileName(fileName);

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
        thumbnail: string;
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

export function getAllPostIds(): string[] {
  return getPostFileNames().map((fileName) => getSlugFromFileName(fileName));
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, getFileNameFromSlug(id));
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { content: fileContent, data: frontMatter } = matter(fileContents);
  const mdxSource = await serialize(fileContent, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [rehypeSlug],
    },
    scope: frontMatter,
  });

  // Combine the data with the id and contentHtml
  return {
    id,
    mdxSource,
    ...(frontMatter as {
      updated_date: string;
      title: string;
      visited_date: string;
    }),
  };
}

function getPostFileNames() {
  return fs.readdirSync(postsDirectory).filter((fileName) => isMdx(fileName));
}

function isMdx(fileName: string) {
  return fileName.endsWith(".mdx");
}

function getSlugFromFileName(fileName: string): string {
  if (isMdx(fileName)) {
    return fileName.replace(/\.mdx$/, "");
  }
  throw Error(`Could not find slug in filename=${fileName}`);
}

function getFileNameFromSlug(slug: string): string {
  return `${slug}.mdx`;
}
