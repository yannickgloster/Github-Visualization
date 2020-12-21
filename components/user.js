import React from "react";
import { Octokit } from "@octokit/rest";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", data: null };
    this.request = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async get_github(user) {
    const octokit = new Octokit({
      auth: process.env.GITHUB_API_KEY,
    });

    const data = await octokit.users.getByUsername({
      username: user,
    });
    return data;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.request = await this.get_github(this.state.value);
    this.setState({ data: this.request["data"]["avatar_url"] });
    console.log(this.state);
  }

  render() {
    return (
      <div>
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
        {this.state.data != null && (
          <img src={this.state.data} alt="Profile Image" />
        )}
      </div>
    );
  }
}

export default User;
