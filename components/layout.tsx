import Head from "next/head";
import styles from "./layout.module.css";
import Link from "next/link";

export const siteTitle = "Jess Goes Outside";

export default function Layout({
  children,
  showBottomHomeLink,
}: {
  children: React.ReactNode;
  showBottomHomeLink?: boolean;
}) {
  // TODO: Update Open Graph Meta tags to improve sharing experience
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A blog about travel and other things"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.header}>
        <nav>
          <Link className={styles.headerItem} href="/">
            Home
          </Link>
          <Link className={styles.headerItem} href="/about">
            About
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      {showBottomHomeLink && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
