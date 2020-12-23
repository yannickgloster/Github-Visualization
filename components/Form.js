import React from "react";
import { Octokit } from "@octokit/rest";
import styles from "./Form.module.css";
import { ResponsiveCalendar } from "@nivo/calendar";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input1: "",
      input2: "",
      dropdown: "user",
      preset: "yannick+account",
      calendar_data: [],
    };

    this.input1HandleChange = this.input1HandleChange.bind(this);
    this.input2HandleChange = this.input2HandleChange.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handlePresetDropdown = this.handlePresetDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async get_github_user(user) {
    const octokit = new Octokit({
      auth: process.env.GITHUB_API_KEY,
    });

    const data = await octokit.users.getByUsername({
      username: user,
    });

    return data;
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
      this.setState({ calendar_data: [] });
      const github_user = await this.get_github_user(input1);
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
          <div className={styles.data}>
            <h4>{new Date().getFullYear()} User Contributions</h4>
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
      </div>
    );
  }
}

export default Form;
