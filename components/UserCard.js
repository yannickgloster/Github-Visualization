import React from "react";
import PropTypes from "prop-types";
import styles from "./UserCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCompass,
  faUser,
} from "@fortawesome/free-regular-svg-icons";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.outerContainer}>
        <img
          className={styles.profile_img}
          src={this.props.image_url}
          alt="Profile Image"
        />
        <div className={styles.innerContainer}>
          <h1>{this.props.name}</h1>
          <h2>
            <a href={this.props.profile_url} target="_blank">
              {this.props.username}
            </a>
          </h2>
          <p>{this.props.bio}</p>
          <div className={styles.item}>
            <FontAwesomeIcon icon={faBuilding} className={styles.icon} />
            <p>{this.props.company}</p>
          </div>
          <div className={styles.item}>
            <FontAwesomeIcon icon={faCompass} className={styles.icon} />
            <p>
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
          </div>
          <div className={styles.item}>
            <img
              src="/github-icon.svg"
              alt="GitHub Octocat Logo"
              className={styles.icon}
            />
            <p>Repos: {this.props.public_repos}</p>
            <p>Gists: {this.props.public_gists}</p>
          </div>
          <div className={styles.item}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            <p>Followers: {this.props.followers}</p>

            <p>Following: {this.props.following}</p>
          </div>
          <p>Member since {this.props.created_at.slice(0, 4)}!</p>
        </div>
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
