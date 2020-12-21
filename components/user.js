import React from "react";
import { Octokit } from "@octokit/rest";

async function get_github(user) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY,
  });

  const data = await octokit.users.getByUsername({
    username: user,
  });
  console.log(data);
}

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    get_github(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Github Account:{" "}
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default User;
