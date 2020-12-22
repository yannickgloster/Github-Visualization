import React from "react";
import PropTypes from "prop-types";
import styles from "./UserCard.module.css";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <img
          className={styles.profile}
          src={this.props.image_url}
          alt="Profile Image"
        />
        <h1>{this.props.name}</h1>
        <h2>
          <a href={this.props.profile_url} target="_blank">
            {this.props.username}
          </a>
        </h2>
        <p>{this.props.bio}</p>
        <p>Works at {this.props.company}</p>
        <p>
          Location:{" "}
          <a
            href={
              "https://www.google.com/maps/search/?api=1&query=" +
              this.props.location
            }
            target="_blank"
          >
            {this.props.location}
          </a>
        </p>
        <p>Repos: {this.props.public_repos}</p>
        <p>Gists: {this.props.public_gists}</p>
        <p>Followers: {this.props.followers}</p>
        <p>Following: {this.props.following}</p>
        <p>Member since {this.props.created_at.slice(0, 4)}!</p>
      </div>
    );
  }
}

UserCard.propTypes = {
  username: PropTypes.string.isRequired,
  profile_url: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  name: PropTypes.string,
  company: PropTypes.string,
  blog: PropTypes.string,
  location: PropTypes.string,
  bio: PropTypes.string,
  public_repos: PropTypes.number,
  public_gists: PropTypes.number,
  followers: PropTypes.number,
  following: PropTypes.number,
  created_at: PropTypes.node,
};

export default UserCard;
