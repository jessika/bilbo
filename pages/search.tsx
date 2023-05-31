import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { useRouter } from "next/router";
import Searchbox from "../components/searchbox";
import { useEffect, useState } from "react";
import PostList from "../components/post-list";

/** Url key whose value is the search text. */
const searchTextKey = "q";

export default function Search({}: {}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const [isSearchTextInitialized, setIsSearchTextInitialized] = useState(false);

  useEffect(
    function onSearchTextChange() {
      if (!searchText) return;

      setIsLoading(true);
      setResults([]);
      fetch(`/api/search?q=${searchText}`)
        .then((res) => res.json())
        .then((res) => {
          setResults(res.postMetadatas);
        })
        .finally(() => {
          setIsLoading(false);
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
    },
    [searchText]
  );

  const onSearchboxTextChange = (searchboxText: string) => {
    if (!searchboxText) return;
    searchboxText = searchboxText.trim();
    if (!searchboxText) return;
    setSearchText(searchboxText);
  };

  // ignore exhaustive-deps warning for `router` and `router.query`. We only want the function to run once the router is ready, not when the query changes.
  useEffect(
    function initializeSearchText() {
      const qValue = router.query[searchTextKey] || "";
      const initialSearchText =
        typeof qValue === "string"
          ? (qValue as string)
          : (qValue as string[]).join(",");
      if (initialSearchText) {
        setSearchText(initialSearchText);
      }
      setIsSearchTextInitialized(true);
    },
    [router.isReady]
  );

  return (
    <Layout showBottomHomeLink>
      <Head>
        <title>{`Search - ${siteTitle}`}</title>
      </Head>
      <section>
        {isSearchTextInitialized && (
          <Searchbox
            initialText={searchText}
            placeholder={"Search..."}
            onChange={onSearchboxTextChange}
            isLoading={isLoading}
          />
        )}
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
