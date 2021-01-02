# Github Visualization tool

Built by Yannick Gloster | `18308167`
[Live Deployment](https://github-visualization.vercel.app/)

This project is built in Javascript using the Next.JS Framework. It is being hosted through Vercel.

This web app allows you to give your Github Username or Repository and displays statistics to determine your productivity and network.

## `.env`

```
NEXT_PUBLIC_GITHUB_API_KEY=<Your Github Personal Access Token>
```

## Docker

Before building, set your local env.

#### Build:

```bash
docker build -t client .
```

#### Deploy:

```bash
docker build -t client . && docker run --name CLIENT_CONTAINER -p 0.0.0.0:5000:3000 client
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
