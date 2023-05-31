import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { useRouter } from "next/router";
import Searchbox from "../components/searchbox";
import { useEffect, useState } from "react";
import PostList from "../components/post-list";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

/** Url key whose value is the search text. */
const searchTextKey = "q";

type ServerSideProps = {
  qValue: string;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const qQueryValue = context.query[searchTextKey] || "";
  const qValue =
    typeof qQueryValue === "string"
      ? (qQueryValue as string).trim()
      : (qQueryValue as string[]).join(",").trim();
  return { props: { qValue } };
};

export default function Search({
  qValue,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [searchText, setSearchText] = useState(qValue);
  const [results, setResults] = useState([]);

  const onSearchboxTextChange = (searchboxText: string) => {
    if (!searchboxText) return;
    searchboxText = searchboxText.trim();
    if (!searchboxText) return;

    setSearchText(searchboxText);
    setIsLoading(true);
    setResults([]);
    fetch(`/api/search?q=${searchboxText}`)
      .then((res) => res.json())
      .then((res) => {
        setResults(res.postMetadatas);
      })
      .finally(() => {
        setIsLoading(false);
      });
    router.replace(
      {
        pathname: router.pathname,
        query: { [searchTextKey]: searchboxText },
      },
      /* as= */ undefined,
      { shallow: true }
    );
  };

  useEffect(function initialize() {
    if (qValue) {
      onSearchboxTextChange(qValue);
    }
  }, []);

  return (
    <Layout showBottomHomeLink>
      <Head>
        <title>{`Search - ${siteTitle}`}</title>
      </Head>
      <section>
        <Searchbox
          initialText={searchText}
          placeholder={"Search..."}
          onChange={onSearchboxTextChange}
          isLoading={isLoading}
          autoFocus={true}
        />
      </section>
      {!!searchText && (
        <h2 style={{ whiteSpace: "pre-wrap" }}>
          Results for &ldquo;{searchText}&rdquo;
        </h2>
      )}
      {!!searchText && !results.length && !isLoading && (
        <span>No results found</span>
      )}
      <PostList postMetadatas={results} />
    </Layout>
  );
}
