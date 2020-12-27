import React from "react";
import { Octokit } from "@octokit/rest";
import styles from "./Form.module.css";
import { ResponsiveCalendar } from "@nivo/calendar";
import { ResponsiveNetwork } from "@nivo/network";

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
    };

    this.input1HandleChange = this.input1HandleChange.bind(this);
    this.input2HandleChange = this.input2HandleChange.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handlePresetDropdown = this.handlePresetDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  containsObject(obj, list) {
    var x;
    for (x in list) {
      if (list.hasOwnProperty(x) && list[x] === obj) {
        return true;
      }
    }

    return false;
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
      }
    }

    if (this.state.dropdown === "user" || preset_select === "user") {
      this.setState({ calendar_data: [], nodes: [], links: [] });
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_API_KEY,
      });

      // Get User Info & Network Graph
      const github_user = await octokit.users.getByUsername({
        username: input1,
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
            var joined = this.state.calendar_data.concat(cal_object);
            this.setState({ calendar_data: joined });
          }
        });
      });
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
              <input
                type="text"
                value={this.state.input1}
                onChange={this.input1HandleChange}
                className={styles.form_element}
              />
            )}
            {this.state.dropdown === "user+repo" && (
              <input
                type="text"
                value={this.state.input2}
                onChange={this.input2HandleChange}
                className={styles.form_element}
              />
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
              </select>
            )}
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.calendar_data.length > 0 && (
          <div className={styles.contributions_data}>
            <h4>{new Date().getFullYear()} User Contributions</h4>
            <p>
              Hover over day to see the number of github activities on that day.
            </p>
            <ResponsiveCalendar
              data={this.state.calendar_data}
              from={new Date(2020, 0, 1)}
              to={new Date(2020, 11, 31)}
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
        {this.state.nodes.length > 0 && (
          <div className={styles.network_data}>
            <h4>User Followers at 2 degrees</h4>
            <p>
              Hover over each node to see the username of the person. The
              diminishing thickness of the line shows the depth of the node.
            </p>
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
            />
          </div>
        )}
      </div>
    );
  }
}

export default Form;
