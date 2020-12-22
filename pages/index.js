import Head from "next/head";
import styles from "../styles/Home.module.css";
import UserForm from "../components/UserForm";
import UserCard from "../components/UserCard";

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
        <UserCard
          username="yannickgloster"
          profile_url="https://github.com/yannickgloster"
          image_url="https://avatars0.githubusercontent.com/u/19475841?v=4"
          name="Yannick Gloster"
          company="Microsoft"
          blog="yannickgloster.com"
          location="Dublin, Ireland"
          bio="Here lies Yannick"
          public_repos={10}
          public_gists={1}
          followers={34}
          following={33}
          created_at="2016-05-19T17:01:09Z"
        />
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <img
            src="/github-octocat.svg"
            alt="GitHub Octocat Logo"
            className={styles.logo_github}
          />
          +
          <img
            src="/vercel.svg"
            alt="Vercel Logo"
            className={styles.logo_vercel}
          />
        </a>
      </footer>
    </div>
  );
}
