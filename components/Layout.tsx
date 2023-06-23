import Head from "next/head";
import styles from "./layout.module.css";
import Link from "next/link";
import { useEffect } from "react";
import { ColorScheme, registerColorSchemeListener } from "../lib/color-schemes";

export const siteTitle = "Jess Goes Outside";

export default function Layout({ children }: { children: React.ReactNode }) {
  // TODO: Update Open Graph Meta tags to improve sharing experience
  useEffect(() => {
    const onScroll = (event: Event) => {
      const header = document.querySelector(`.${styles.header}`);
      if (header) {
        if (window.scrollY === 0) {
          header.classList.remove(styles.headerScrolled);
        } else {
          header.classList.add(styles.headerScrolled);
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    return registerColorSchemeListener((theme: ColorScheme) => {
      document.body.dataset.bsTheme = theme;
    });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Jess Goes Outside is a blog about outdoor exploration and travel, based on a regular girl's experiences in the world."
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.header}>
        <nav className={styles.headerInternal}>
          <Link className={styles.headerItem} href="/">
            Home
          </Link>
          <Link className={styles.headerItem} href="/about">
            About
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.mainInternal}>{children}</div>
      </main>
      <div className={styles.footer}>
        <div className={styles.footerInternal}>
          Copyright © 2023 Jess Goes Outside
        </div>
      </div>
    </div>
  );
}
