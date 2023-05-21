import Layout from "../../components/layout";
import {
  getAllPostIds,
  getPostData,
  getSuggestedPostMetadatas,
  PostData,
  PostMetadata,
} from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
import { MDXRemote } from "next-mdx-remote";
import PostListItem, { ItemLayout } from "../../components/post-list-item";
import styles from "./id.module.scss";
import Image from "next/image";

/** Components used within MDX files. */
const mdxComponents = {
  img: (props: { alt: string; height: string; width: string; src: string }) => {
    const style = {
      maxWidth: `${props.width}px`,
      width: "100%",
      height: "auto",
    };
    // height and width are part of the props, so they get automatically passed here with {...props}
    return <Image {...props} loading="lazy" style={style} />;
  },
};

export default function Post({
  postData,
  suggestedPostMetadatas,
}: {
  postData: PostData;
  suggestedPostMetadatas: PostMetadata[];
}) {
  return (
    <Layout showBottomHomeLink>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className={styles.article}>
        <h1 className={styles.h1}>{postData.title}</h1>
        <div className={styles.date}>
          Visited{" "}
          <Date dateString={postData.visited_date} formatString={"LLLL yyyy"} />
        </div>
        <main>
          <MDXRemote {...postData.mdxSource} components={mdxComponents} />
        </main>
      </article>
      <div className={styles.suggestedPostsContainer}>
        <h2>Suggested posts</h2>
        <ul className={`${utilStyles.list} ${styles.suggestedPosts}`}>
          {suggestedPostMetadatas.map(
            ({ id, updated_date, thumbnail, title, visited_date }) => (
              <PostListItem
                key={id}
                id={id}
                itemLayout={ItemLayout.Narrow}
                thumbnail={thumbnail}
                title={title}
                updatedDate={updated_date}
                visitedDate={visited_date}
              />
            )
          )}
        </ul>
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
