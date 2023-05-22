import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { PostMetadata, getSortedPostMetadatas } from "../lib/posts";
import { GetStaticProps } from "next";
import PostList from "../components/post-list";

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
        <PostList postMetadatas={postMetadatas} />
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
