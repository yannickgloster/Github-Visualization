import Head from "next/head";
import UserForm from "../components/Form";
import styles from "../styles/Home.module.css";

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
          <UserForm />
        </div>
      </main>

      <footer className={styles.footer}>
        v0.2.0 | Powered by{" "}
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <img
            src="/github-octocat.svg"
            alt="GitHub Octocat Logo"
            className={styles.logoGithub}
          />
        </a>
        +
        <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
          <img
            src="/vercel.svg"
            alt="Vercel Logo"
            className={styles.logoVercel}
          />
        </a>
      </footer>
    </div>
  );
}
