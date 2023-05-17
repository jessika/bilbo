import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { PostMetadata, getSortedPostMetadatas } from "../lib/posts";
import { GetStaticProps } from "next";
import PostListItem from "../components/post-list-item";

export default function Home({
  postMetadatas,
}: {
  postMetadatas: PostMetadata[];
}) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h1 className={utilStyles.headingLg}>Latest posts</h1>
        <ul className={utilStyles.list}>
          {postMetadatas.map(
            ({ id, updated_date, thumbnail, title, visited_date }) => (
              <PostListItem
                key={id}
                id={id}
                thumbnail={thumbnail}
                title={title}
                updatedDate={updated_date}
                visitedDate={visited_date}
              />
            )
          )}
        </ul>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const postMetadatas = getSortedPostMetadatas();
  return {
    props: {
      postMetadatas,
    },
  };
};
