import Head from "next/head";
import styles from "../styles/Home.module.css";
import User from "../components/user";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Visualization</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://github.com/">GitHub</a> Visualization
        </h1>

        <div className={styles.description}>
          <User />
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <img src="/github-octocat.svg" alt="GitHub" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
