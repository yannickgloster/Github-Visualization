export default async (req, res) => {
  const {
    query: { user },
  } = req;

  const headers = {
    Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_API_KEY}`,
  };

  const body = {
    query: `query {
            user(login: "${user}") {
              name
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`,
  };

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers,
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};
