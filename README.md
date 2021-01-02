# Github Visualization tool

Built by Yannick Gloster | `18308167`
[Live Deployment](https://github-visualization.vercel.app/)

This project is built in Javascript using the Next.JS Framework. It is being hosted through Vercel.

This web app allows you to give your Github Username or Repository and displays statistics to determine your productivity and network.

## Docker

Before compiling on docker, you need to setup the `.env` file. This file contains the [Github API Personal Token](https://github.com/settings/tokens/). Without this token, the application would run out of requests as the Github API is rate limited to 60 requests per hour without a personal token and 5000 requests per hour with the token.

After cloning the repository, in the working directory, create a file called `.env`

```bash
NEXT_PUBLIC_GITHUB_API_KEY=<YOUR TOKEN HERE>
```

### Build

Once that is set, you can build the Docker image with the command:

```bash
docker build -t client .
```

### Deploy

You can then deploy the the app using the following command:

```bash
docker build -t client . && docker run --name CLIENT_CONTAINER -p 0.0.0.0:5000:3000 client
```

You can then access the site at [http://localhost:5000/](http://localhost:5000/)
