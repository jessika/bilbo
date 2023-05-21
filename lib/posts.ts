/**
 * @fileoverview Functions that help with getting post data.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import rehypeImgSize from "rehype-img-size";
import rehypeFigure from "rehype-figure";

const postsDirectory = path.join(process.cwd(), "posts");

/** Number of posts to show in the suggested posts list. */
const NUM_SUGGESTED_POSTS = 2;

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

/** Returns suggested posts based on a current post id. */
export function getSuggestedPostMetadatas(id: string): PostMetadata[] {
  const postMetadatas = getSortedPostMetadatas();
  const currentPostIndex = postMetadatas.findIndex(
    (postMetadata) => postMetadata.id === id
  );
  // Use the posts written just before the current post
  const suggestedPostMetadatas = postMetadatas.slice(
    currentPostIndex + 1,
    currentPostIndex + 1 + NUM_SUGGESTED_POSTS
  );
  // If there are not enough posts, use the most recently written posts
  if (
    suggestedPostMetadatas.length < NUM_SUGGESTED_POSTS &&
    postMetadatas.length > NUM_SUGGESTED_POSTS
  ) {
    suggestedPostMetadatas.push(
      ...postMetadatas.slice(
        0,
        NUM_SUGGESTED_POSTS - suggestedPostMetadatas.length
      )
    );
  }
  return suggestedPostMetadatas;
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
      rehypePlugins: [
        rehypeSlug,
        [rehypeImgSize, { dir: "public" }],
        [rehypeFigure, { className: "mdxFigure" }],
      ],
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
