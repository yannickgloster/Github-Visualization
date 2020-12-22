import React from "react";
import { Octokit } from "@octokit/rest";
import styles from "./UserForm.module.css";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", data: null };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async get_github_user(user) {
    const octokit = new Octokit({
      auth: process.env.GITHUB_API_KEY,
    });

    const data = await octokit.users.getByUsername({
      username: user,
    });

    this.setState({ data: data["data"]["name"] });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    await this.get_github_user(this.state.value);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Have a drop down here for the different inputs (User & repo, user,
            org) <br /> Github Account:{" "}
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.data != null && <p>Loaded {this.state.data}</p>}
      </div>
    );
  }
}

export default UserForm;
