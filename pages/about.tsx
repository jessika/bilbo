import Head from 'next/head'
import Layout from '../components/layout'

const aboutBlurb = `I'm Jess, and this is my personal blog. I'll be writing some travel reports among other things.`

export default function About() {
  return <Layout>
      <Head>
        <title>About</title>
      </Head>
      {aboutBlurb}
    </Layout>
}