import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { useRouter } from "next/router";
import Searchbox from "../components/searchbox";
import { useEffect, useState } from "react";
import PostList from "../components/post-list";

/** Url key whose value is the search text. */
const searchTextKey = "q";

export default function Search({}: {}) {
  let isLoading = false;
  const router = useRouter();
  const qValue = router.query[searchTextKey] || "";
  const initialSearchText =
    typeof qValue === "string"
      ? (qValue as string)
      : (qValue as string[]).join(",");
  const [searchText, setSearchText] = useState(initialSearchText);
  const [results, setResults] = useState([]);

  const handleSearchTextUpdate = (searchText: string) => {
    if (!searchText) return;
    if (!searchText.trim()) return;

    setSearchText(searchText);
    isLoading = true;
    fetch(`/api/search?q=${searchText}`)
      .then((res) => res.json())
      .then((res) => {
        setResults(res.postMetadatas);
      })
      .finally(() => {
        isLoading = false;
      });
    // TODO: Detect url query change when going back in browser history
    router.replace(
      {
        pathname: router.pathname,
        query: { [searchTextKey]: searchText },
      },
      /* as= */ undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    handleSearchTextUpdate(initialSearchText);
  }, [router.isReady]);

  return (
    <Layout showBottomHomeLink>
      <Head>
        <title>{`Search - ${siteTitle}`}</title>
      </Head>
      <section>
        <Searchbox
          initialText={initialSearchText}
          placeholder={"Search..."}
          onChange={handleSearchTextUpdate}
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
