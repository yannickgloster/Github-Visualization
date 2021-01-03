import React from "react";
import { Octokit } from "@octokit/rest";
import styles from "./Form.module.css";
import { ResponsiveCalendar } from "@nivo/calendar";
import { ResponsiveNetwork } from "@nivo/network";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input1: "",
      input2: "",
      dropdown: "user",
      preset: "yannick+account",
      calendar_data: [],
      nodes: [],
      links: [],
      user_img: "",
      user_url: "",
      user_repos: [],
      pie_data: [],
      line_data: [],
      contribution_year: new Date().getFullYear(),
      search_error: false,
      repo_img: "",
      repo_url: "",
    };

    this.input1HandleChange = this.input1HandleChange.bind(this);
    this.input2HandleChange = this.input2HandleChange.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handlePresetDropdown = this.handlePresetDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.contributionYear = this.contributionYear.bind(this);
  }

  handleDropdown(event) {
    this.setState({ dropdown: event.target.value });
  }

  handlePresetDropdown(event) {
    this.setState({ preset: event.target.value });
  }

  input1HandleChange(event) {
    this.setState({ input1: event.target.value });
  }

  input2HandleChange(event) {
    this.setState({ input2: event.target.value });
  }

  contributionYear(event) {
    this.setState({ contribution_year: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let preset_select = "";
    let input1 = this.state.input1;
    let input2 = this.state.input2;
    if (this.state.dropdown === "presets") {
      if (this.state.preset === "yannick+account") {
        input1 = "yannickgloster";
        preset_select = "user";
      } else if (this.state.preset === "brian+account") {
        input1 = "branflakes6";
        preset_select = "user";
      } else if (this.state.preset === "pinaqui+account") {
        input1 = "eoinpinaqui";
        preset_select = "user";
      } else if (this.state.preset === "yannick+account+repo") {
        input1 = "yannickgloster";
        input2 = "discord-10man";
        preset_select = "user+repo";
      }
    }

    this.setState({
      search_error: false,
      calendar_data: [],
      line_data: [],
      nodes: [],
      links: [],
      user_img: "",
      repo_img: "",
      user_repos: [],
      pie_data: [],
      repo_url: "",
      user_url: "",
    });

    if (this.state.dropdown === "user" || preset_select === "user") {
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_API_KEY,
      });

      // Get User Info & Network Graph
      try {
        this.setState({
          pie_data: [
            {
              id: "morning",
              label: "Morning (5am - 10am)",
              value: 0,
              color: "#FAB195",
            },
            {
              id: "day",
              label: "Daytime (11am - 4pm)",
              value: 0,
              color: "#C06C84",
            },
            {
              id: "evening",
              label: "Evening (5pm - 9pm)",
              value: 0,
              color: "#6CB7B",
            },
            {
              id: "night",
              label: "Nighttime (10pm - 4am)",
              value: 0,
              color: "#355C7D",
            },
          ],
        });

        const github_user = await octokit.users.getByUsername({
          username: input1,
        });

        this.setState({ user_url: github_user["data"]["html_url"] });

        const events = await octokit.paginate(
          "GET /users/" + input1 + "/events"
        );

        events.forEach((event) => {
          const hour = new Date(event["created_at"]).getHours();
          let pie = this.state.pie_data;
          if (hour > 4 && hour <= 10) {
            pie[0]["value"] = pie[0]["value"] + 1;
          } else if (hour > 10 && hour <= 16) {
            pie[1]["value"] = pie[1]["value"] + 1;
          } else if (hour > 16 && hour <= 21) {
            pie[2]["value"] = pie[2]["value"] + 1;
          } else if (hour > 21 && hour <= 4) {
            pie[3]["value"] = pie[3]["value"] + 1;
          }
          this.setState({ pie_data: pie });
        });

        const user_repos = await octokit.paginate(
          "GET /users/" + input1 + "/repos"
        );

        user_repos.forEach((repo) => {
          const repo_data = {
            username: repo["owner"]["login"],
            name: repo["name"],
            url: repo["html_url"],
          };
          this.setState({
            user_repos: this.state.user_repos.concat(repo_data),
          });
        });

        this.setState({
          user_img:
            "https://github-readme-stats.vercel.app/api?username=" + input1,
        });

        // put in paginator
        const github_followers = await octokit.users.listFollowersForUser({
          username: input1,
        });

        let nodes = [
          {
            id: github_user["data"]["login"],
            radius: 14,
            depth: 1,
            color: "rgb(255, 0, 0)",
          },
        ];

        let links = [];

        // Refactor to duplication
        github_followers["data"].forEach(async (follower) => {
          const child_follower = await octokit.users.listFollowersForUser({
            username: follower["login"],
          });
          child_follower["data"].forEach((child) => {
            if (!nodes.some((node) => node.id === child["login"])) {
              const node_object = {
                id: child["login"],
                radius: 10,
                depth: 3,
                color:
                  "rgb(" +
                  Math.floor(Math.random() * 256) +
                  ", " +
                  Math.floor(Math.random() * 256) +
                  ", " +
                  Math.floor(Math.random() * 256) +
                  ")",
              };
              nodes = nodes.concat(node_object);
            }

            const link = {
              source: follower["login"],
              target: child["login"],
              distance: 100,
            };

            links = links.concat(link);
          });

          if (!nodes.some((node) => node.id === follower["login"])) {
            const node_object = {
              id: follower["login"],
              radius: 10,
              depth: 2,
              color:
                "rgb(" +
                Math.floor(Math.random() * 256) +
                ", " +
                Math.floor(Math.random() * 256) +
                ", " +
                Math.floor(Math.random() * 256) +
                ")",
            };
            nodes = nodes.concat(node_object);
          }

          const link = {
            source: github_user["data"]["login"],
            target: follower["login"],
            distance: 100,
          };

          links = links.concat(link);
          this.setState({ nodes: nodes, links: links });
        });

        // Get Github Contributions
        const github_user_contributions_request = await fetch(
          "/api/contributions?user=" + input1,
          {
            method: "GET",
          }
        );
        const github_user_contributions = await github_user_contributions_request.json();
        github_user_contributions["data"]["user"]["contributionsCollection"][
          "contributionCalendar"
        ]["weeks"].forEach((week) => {
          week["contributionDays"].forEach((day) => {
            if (day["contributionCount"] > 0) {
              const cal_object = {
                day: day["date"],
                value: day["contributionCount"],
              };
              var joined_cal = this.state.calendar_data.concat(cal_object);
              this.setState({
                calendar_data: joined_cal,
              });
            }
          });
        });
      } catch (e) {
        this.setState({ search_error: true });
      }
    } else if (
      this.state.dropdown === "user+repo" ||
      preset_select === "user+repo"
    ) {
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_API_KEY,
      });

      this.setState({
        repo_img:
          "https://github-readme-stats.vercel.app/api/pin/?username=" +
          input1 +
          "&repo=" +
          input2,
      });

      try {
        const repo = await octokit.repos.get({
          owner: input1,
          repo: input2,
        });

        const contributors = await octokit.repos.getContributorsStats({
          owner: input1,
          repo: input2,
        });

        this.setState({ repo_url: repo["data"]["html_url"] });

        console.log(contributors);

        contributors["data"].forEach((contributor) => {
          let contributor_data = {
            id: contributor["author"]["login"],
            data: [],
          };

          contributor["weeks"].forEach((week) => {
            if (week["c"] > 0) {
              contributor_data["data"].push({
                x: new Date(week["w"] * 1000).toISOString().split("T")[0],
                y: week["a"] - week["d"],
              });
            }
          });
          this.setState({
            line_data: this.state.line_data.concat(contributor_data),
          });
        });
      } catch (e) {
        this.setState({ search_error: true });
      }
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <select
            name="select"
            id="select"
            value={this.state.dropdown}
            onChange={this.handleDropdown}
            className={styles.form_element}
          >
            <option value="user">Github User</option>
            <option value="user+repo">Github User & Repo</option>
            <option value="presets">Presets</option>
          </select>
          <label>
            {(this.state.dropdown === "user+repo" ||
              this.state.dropdown === "user") && (
              <>
                User:
                <input
                  type="text"
                  value={this.state.input1}
                  onChange={this.input1HandleChange}
                  className={styles.form_element}
                />
              </>
            )}
            {this.state.dropdown === "user+repo" && (
              <>
                Repo:
                <input
                  type="text"
                  value={this.state.input2}
                  onChange={this.input2HandleChange}
                  className={styles.form_element}
                />
              </>
            )}
            {this.state.dropdown === "presets" && (
              <select
                name="preset_select"
                id="preset_select"
                value={this.state.preset}
                onChange={this.handlePresetDropdown}
                className={styles.form_element}
              >
                <option value="yannick+account">
                  Yannick's GitHub Account
                </option>
                <option value="brian+account">Brian's GitHub Account</option>
                <option value="pinaqui+account">
                  Pinaqui's GitHub Account
                </option>
                <option value="yannick+account+repo">
                  Yannick's Discord-10man
                </option>
              </select>
            )}
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.user_img.length > 0 && !this.state.search_error && (
          <div>
            <a href={this.state.user_url} target="_blank">
              <img src={this.state.user_img} />
            </a>
          </div>
        )}
        {this.state.pie_data.length > 0 && !this.state.search_error && (
          <div className={styles.pie_data}>
            <ResponsivePie
              data={this.state.pie_data}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "nivo" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              radialLabelsSkipAngle={10}
              radialLabelsTextColor="#333333"
              radialLabelsLinkColor={{ from: "color" }}
              sliceLabelsSkipAngle={10}
              sliceLabelsTextColor="#333333"
              legends={[
                {
                  anchor: "bottom",
                  direction: "column",
                  justify: false,
                  translateX: 0,
                  translateY: 75,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: "#000",
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        )}
        {this.state.calendar_data.length > 0 && !this.state.search_error && (
          <div className={styles.contributions_data}>
            <h4>
              <select
                name="year"
                id="year"
                value={this.state.contribution_year}
                onChange={this.contributionYear}
                className={styles.form_element}
              >
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>
                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>
              </select>{" "}
              User Contributions
            </h4>
            <ResponsiveCalendar
              data={this.state.calendar_data}
              from={new Date(this.state.contribution_year, 0, 1)}
              to={new Date(this.state.contribution_year, 11, 31)}
              emptyColor="#eeeeee"
              colors={["#C5E8B7", "#ABE098", "#83D475", "#57C84D", "#2EB62C"]}
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "row",
                  translateY: 36,
                  itemCount: 4,
                  itemWidth: 42,
                  itemHeight: 36,
                  itemsSpacing: 14,
                  itemDirection: "right-to-left",
                },
              ]}
            />
          </div>
        )}
        {this.state.nodes.length > 0 && !this.state.search_error && (
          <div className={styles.network_data}>
            <h4>User Followers Connections at 2 degrees</h4>
            <ResponsiveNetwork
              nodes={this.state.nodes}
              links={this.state.links}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              repulsivity={150}
              iterations={20}
              nodeColor={function (e) {
                return e.color;
              }}
              nodeBorderWidth={1}
              nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
              linkThickness={function (e) {
                return 2 * (4 - e.source.depth);
              }}
              motionStiffness={160}
              motionDamping={12}
              distanceMax={200}
              distanceMin={20}
              tooltip={(node) => {
                return (
                  <div>
                    Username:{" "}
                    <strong style={{ color: node.color }}>{node.id}</strong>
                  </div>
                );
              }}
            />
          </div>
        )}
        {this.state.user_repos.length > 0 && !this.state.search_error && (
          <div className={styles.repos}>
            <h4>Repos</h4>
            <br />
            <div className={styles.repos_parent}>
              {this.state.user_repos.map((repo) => (
                <div className={styles.repos_image}>
                  <a href={repo["url"]} target="_blank">
                    <img
                      src={
                        "https://github-readme-stats.vercel.app/api/pin/?username=" +
                        repo["username"] +
                        "&repo=" +
                        repo["name"]
                      }
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {this.state.repo_img.length > 0 && !this.state.search_error && (
          <div>
            <a href={this.state.repo_url} target="_blank">
              <img src={this.state.repo_img} />
            </a>
          </div>
        )}

        {this.state.line_data.length > 0 && !this.state.search_error && (
          <div className={styles.repo_contributions}>
            <h4>User Contributions Over Time</h4>
            <ResponsiveLine
              data={this.state.line_data}
              margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
              animate={true}
              xScale={{
                type: "time",
                format: "%Y-%m-%d",
                useUTC: true,
                precision: "day",
              }}
              xFormat="time:%Y-%m-%d"
              yScale={{
                type: "linear",
                stacked: false,
                min: "auto",
                max: "auto",
              }}
              colors={{ scheme: "set1" }}
              axisLeft={{
                legend: "linear scale",
                legendOffset: 12,
              }}
              axisBottom={{
                format: "%b %d",
                legend: "time scale",
                legendOffset: -12,
                tickRotation: 90,
              }}
              legend="Date"
              curve={"monotoneX"}
              enablePointLabel={true}
              pointSize={16}
              pointBorderWidth={1}
              pointBorderColor={{
                from: "color",
                modifiers: [["darker", 0.3]],
              }}
              useMesh={true}
              enableSlices={false}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        )}
        {this.state.search_error && (
          <div>
            <h4>Error in search, try again</h4>
          </div>
        )}
      </div>
    );
  }
}

export default Form;
