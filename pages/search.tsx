import Head from "next/head";
import Layout, { siteTitle } from "../components/Layout";
import { NextRouter, useRouter } from "next/router";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";
import PostList from "../components/PostList";
import utilStyles from "../styles/utils.module.css";

/** Url key whose value is the search text. */
const searchTextKey = "q";

function getUrlSearchText(router: NextRouter) {
  const qQueryValue = router.query[searchTextKey] || "";
  const qValue =
    typeof qQueryValue === "string"
      ? (qQueryValue as string).trim()
      : (qQueryValue as string[]).join(",").trim();
  return qValue;
}

export default function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [isSearchTextInitialized, setIsSearchTextInitialized] = useState(false);

  useEffect(
    function initialize() {
      const urlSearchText = getUrlSearchText(router);
      if (urlSearchText) {
        setSearchText(urlSearchText);
      }
      setIsSearchTextInitialized(true);
    },
    [router.isReady]
  );

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

  const onSearchBoxTextChange = (searchBoxText: string) => {
    if (!searchBoxText) return;
    searchBoxText = searchBoxText.trim();
    if (!searchBoxText) return;
    setSearchText(searchBoxText);
  };

  return (
    <Layout>
      <Head>
        <title>{`Search | ${siteTitle}`}</title>
      </Head>
      <section>
        {isSearchTextInitialized && (
          <SearchBox
            initialText={searchText}
            placeholder={"Search..."}
            onChange={onSearchBoxTextChange}
            isLoading={isLoading}
            autoFocus={true}
          />
        )}
      </section>
      {!!searchText && (
        <h1 className={utilStyles.headingLg} style={{ whiteSpace: "pre-wrap" }}>
          Results for &ldquo;{searchText}&rdquo;
        </h1>
      )}
      {!!searchText && !results.length && !isLoading && (
        <span>No results found</span>
      )}
      <PostList postMetadatas={results} />
    </Layout>
  );
}
