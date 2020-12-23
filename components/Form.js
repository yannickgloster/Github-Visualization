import React from "react";
import { Octokit } from "@octokit/rest";
import styles from "./Form.module.css";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input1: "", input2: "", dropdown: "user" };

    this.input1HandleChange = this.input1HandleChange.bind(this);
    this.input2HandleChange = this.input2HandleChange.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
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

  input1HandleChange(event) {
    this.setState({ input1: event.target.value });
  }

  input2HandleChange(event) {
    this.setState({ input2: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.dropdown === "user") {
      const github_user = await this.get_github_user(this.state.input1);
      const github_user_contributions = await fetch(
        "/api/contributions?user=" + this.state.input1,
        {
          method: "GET",
        }
      );
      console.log(await github_user);
      console.log(await github_user_contributions.json());
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
          </select>
          <label>
            <input
              type="text"
              value={this.state.input1}
              onChange={this.input1HandleChange}
              className={styles.form_element}
            />
            {this.state.dropdown === "user+repo" && (
              <input
                type="text"
                value={this.state.input2}
                onChange={this.input2HandleChange}
                className={styles.form_element}
              />
            )}
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Form;
