import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { useRouter } from "next/router";
import Searchbox from "../components/searchbox";
import { useEffect, useState } from "react";

const searchTermKey = "q";

export default function Search({}: {}) {
  const router = useRouter();
  const qValue = router.query[searchTermKey] || "";
  const initialSearchText =
    typeof qValue === "string"
      ? (qValue as string)
      : (qValue as string[]).join(",");
  const [searchText, setSearchText] = useState(initialSearchText);
  useEffect(() => {
    setSearchText(initialSearchText);
  }, [router.isReady]);
  const handleSearchTextUpdate = (text: string) => {
    setSearchText(text);
    // TODO: Detect url query change when going back in browser history
    router.push({
      pathname: router.pathname,
      query: { [searchTermKey]: text },
    });
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h1 className={utilStyles.headingLg}>Search</h1>
        <Searchbox
          initialText={initialSearchText}
          onChange={handleSearchTextUpdate}
        ></Searchbox>
        {!!searchText && <div>You searched for &quot;{searchText}&quot;</div>}
      </section>
    </Layout>
  );
}
