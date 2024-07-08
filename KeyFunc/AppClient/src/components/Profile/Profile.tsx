import "./Profile.css";
import "../Navbar/NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { Post, User } from "../../types";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useParams } from "react-router-dom";
import {
  followUser,
  getUserByUsername,
  unfollowUser,
} from "../../features/userSlice";
import { axiosInstance as axios } from "../../axiosInstance";
import { Spinner } from "react-bootstrap";
import PostModal from "../PostModal/PostModal";
import PostPreview from "../PostPreview/PostPreview";
function Profile() {
  const { username } = useParams();

  const [postElements, setPosts] = useState<JSX.Element[]>([]);

  const user = useAppSelector((state) => state.auth.User);

  const profileUser = useAppSelector((state) => state.user.userProfile);

  const dispatch = useAppDispatch();

  const createPostRows = () => {
    let posts: JSX.Element[] = [];
    const postRows: JSX.Element[] = [];

    profileUser?.posts?.forEach((p, idx) => {
      posts.push(<PostPreview {...p} key={p.id + "preview"} />);

      if (
        (idx + 1) % 3 === 0 ||
        (profileUser.posts?.length && idx === profileUser.posts?.length - 1)
      ) {
        postRows.push(
          <div className="profile-posts-row" key={p.id + "-post" + p.userId}>
            {posts}
          </div>
        );
        posts = [];
      }
    });

    setPosts(postRows);
  };

  const getUser = async () => {
    await dispatch(getUserByUsername(username));
  };

  const follow = async () => {
    const followedUser = await dispatch(
      followUser({
        followUsername: profileUser?.username,
        user,
      })
    );
  };
  const unfollow = async () => {
    const unfollowedUser = await dispatch(
      unfollowUser({
        followUsername: profileUser?.username,
        user,
      })
    );
  };

  useEffect(() => {
    getUser();
  }, [username]);

  useEffect(() => {
    createPostRows();
  }, [profileUser]);

  if (!profileUser || profileUser.username !== username) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="small-profile-head">
          <div className="profile-head-text">{profileUser.username}</div>
        </div>
        <div className="profile-header-container">
          <div className="profile-pfp-container">
            <div className="profile-pfp">
              <span>
                <img
                  src="https://www.nationalworld.com/jpim-static/image/2023/04/22/13/hello%20mr%20police.jpg?width=1200&enable=upscale"
                  alt="pfp"
                ></img>
              </span>
            </div>
          </div>
          <div className="profile-description-container">
            <div className="profile-description-username">
              <h2>{profileUser.username}</h2>
              <div className="profile-description-buttons">
                {user?.id && profileUser.followers[user?.id] ? (
                  <button className="follow-button" onClick={unfollow}>
                    Following
                  </button>
                ) : (
                  <button
                    className="follow-button"
                    style={{
                      backgroundColor: "rgb(0, 149, 246)",
                      color: "white",
                    }}
                    onClick={follow}
                  >
                    Follow
                  </button>
                )}
                <button className="message-button">Message</button>
              </div>
            </div>
            <div className="profile-header-spacer"></div>
            <div className="profile-header-info">
              <div className="profile-info-item ">
                <span style={{ fontWeight: 700 }}>
                  {profileUser.posts?.length}{" "}
                </span>{" "}
                posts
              </div>
              <div className="profile-info-item ">
                <span style={{ fontWeight: 700 }}>
                  {Object.keys(profileUser.followers).length}{" "}
                </span>{" "}
                followers
              </div>
              <div className="profile-info-item">
                <span style={{ fontWeight: 700 }}>
                  {Object.keys(profileUser.following).length}{" "}
                </span>{" "}
                following
              </div>
            </div>
          </div>
        </div>
        <div className="small-header-info ">
          <div className="profile-info-item ">
            <span className="small-span">
              <span style={{ fontWeight: 700, display: "block" }}>
                {profileUser.posts?.length}{" "}
              </span>{" "}
              posts
            </span>
          </div>
          <div className="profile-info-item ">
            <span className="small-span">
              <span style={{ fontWeight: 700, display: "block" }}>
                {Object.keys(profileUser.followers).length}{" "}
              </span>{" "}
              followers
            </span>
          </div>
          <div className="profile-info-item">
            <span className="small-span">
              <span style={{ fontWeight: 700, display: "block" }}>
                {Object.keys(profileUser.following).length}{" "}
              </span>{" "}
              following
            </span>
          </div>
        </div>
        <div className="profile-posts">
          <div className="profile-posts-header">
            <div className="profile-header-item">
              <FontAwesomeIcon icon={faTableCells} />
              <span style={{ marginLeft: "6px" }}>posts</span>
            </div>
          </div>

          {postElements}
        </div>
      </div>
    </div>
  );
}

export default Profile;
