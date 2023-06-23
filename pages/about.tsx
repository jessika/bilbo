import Head from "next/head";
import Layout from "../components/Layout";
import { siteTitle } from "../components/Layout";

const aboutBlurb = `Hello there! I've created this little corner in the interwebs to document my travels and outdoor explorations. Feel free to leave me a comment at jessgoesoutside.blog@gmail.com. -Jess`;

export default function About() {
  return (
    <Layout>
      <Head>
        <title>{`About | ${siteTitle}`}</title>
      </Head>
      {aboutBlurb}
    </Layout>
  );
}
