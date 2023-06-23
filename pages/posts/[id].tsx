import Layout from "../../components/Layout";
import {
  getAllPostIds,
  getPostData,
  getSuggestedPostMetadatas,
  PostData,
  PostMetadata,
} from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/Date";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
import { MDXRemote } from "next-mdx-remote";
import PostListItem, { ItemLayout } from "../../components/PostListItem";
import styles from "./id.module.scss";
import Image from "next/image";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { CommentSection } from "../../components/CommentSection";
import { useRouter } from "next/router";
import { siteTitle } from "../../components/Layout";

/** Components used within MDX files. */
const mdxComponents = {
  img: (
    props: DetailedHTMLProps<
      ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >
  ) => {
    const style = {
      maxWidth: `${props.width}px`,
      width: "100%",
      height: "auto",
    };
    return (
      <Image
        alt={props.alt || ""}
        height={props.height as number}
        width={props.width as number}
        src={props.src as string}
        loading={props.loading === "eager" ? "eager" : "lazy"}
        style={style}
      />
    );
  },
};

export default function Post({
  postData,
  suggestedPostMetadatas,
}: {
  postData: PostData;
  suggestedPostMetadatas: PostMetadata[];
}) {
  let router = useRouter();
  return (
    <Layout>
      <Head>
        <title>{`${postData.title} | ${siteTitle}`}</title>
      </Head>
      <article className={styles.article}>
        <h1 className={styles.h1}>{postData.title}</h1>
        <div className={styles.date}>
          Visited{" "}
          <Date dateString={postData.visited_date} formatString={"LLLL yyyy"} />
        </div>
        <main className={styles.main}>
          <MDXRemote {...postData.mdxSource} components={mdxComponents} />
        </main>
      </article>
      <div className={styles.divider}></div>
      <div>
        <h2 className={styles.suggestedPostsHeader}>Suggested posts</h2>
        <ul className={`${utilStyles.list} ${styles.suggestedPosts}`}>
          {suggestedPostMetadatas.map(
            ({ id, updated_date, thumbnail, title, visited_date }) => (
              <PostListItem
                key={id}
                id={id}
                itemLayout={ItemLayout.Narrow}
                useLazyLoading={true}
                thumbnail={thumbnail}
                title={title}
                updatedDate={updated_date}
                visitedDate={visited_date}
              />
            )
          )}
        </ul>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.comments}>
        <CommentSection location={postData.id}></CommentSection>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = getAllPostIds();
  const paths = ids.map((id) => ({ params: { id } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string);
  const suggestedPostMetadatas = getSuggestedPostMetadatas(
    params?.id as string
  );
  return {
    props: {
      postData,
      suggestedPostMetadatas,
    },
  };
};
