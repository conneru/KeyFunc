import "./Post.css";
import "@fortawesome/fontawesome-svg-core";
import { Carousel } from "react-bootstrap";
import { Image, Post as PostType } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart,
  faPaperPlane,
  faComment,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { useRef, useState } from "react";
import NavBar from "../Navbar/NavBar";
import { calculateTimeDiff } from "../../hooks";

function Post(post: PostType) {
  const [comment, setComment] = useState("");

  const textareaRef = useRef<HTMLDivElement>(null);

  const handleChange = (comment: string) => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(
        80,
        Math.max(18, textarea.scrollHeight)
      )}px`;
      setComment(comment);
    }
  };

  let timePassed = calculateTimeDiff(post.createdAt);

  return (
    // <div className="post">
    //   <div className="post-header-wrapper">
    //     <div className="post-header">
    //       <canvas className="pfp-container">
    //         <img
    //           className="pfp"
    //           alt="ProfilePicture"
    //           src={
    //             post.user?.profilePic ||
    //             "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1380"
    //           }
    //         />
    //       </canvas>
    //       <div className="header-span-container">
    //         <span>{post.user?.username}</span>
    //       </div>
    //     </div>
    //   </div>
    //   <div>
    //     <div>
    //       <Carousel
    //         interval={null}
    //         indicators={false}
    //         prevIcon={<FontAwesomeIcon icon={faCircleArrowLeft} />}
    //         nextIcon={<FontAwesomeIcon icon={faCircleArrowRight} />}
    //         wrap={false}
    //       >
    //         {post.images.map((i: Image, idx: number) => {
    //           return (
    //             <Carousel.Item key={i.id}>
    //               <img
    //                 className="post-image"
    //                 src={i.url}
    //                 alt={"Image" + idx}
    //               ></img>
    //             </Carousel.Item>
    //           );
    //         })}
    //       </Carousel>
    //       <span style={{ fontWeight: "bold" }}>{post.user?.username}</span>
    //       <span> {post.description}</span>
    //     </div>
    //     {post.comments?.map((comment) => {
    //       return (
    //         <div key={comment.id}>
    //           <div>
    //             {comment.user?.username}: {comment.content}
    //           </div>
    //         </div>
    //       );
    //     })}
    //     <input
    //       placeholder="Add a Comment..."
    //       value={comment}
    //       onChange={(e) => setComment(e.target.value)}
    //     />
    //     {comment.length > 0 ? (
    //       <span style={{ color: "blue", right: "100%" }}>Post</span>
    //     ) : null}
    //   </div>
    // </div>

    <div className="post">
      <div className="post-header-wrapper">
        <div className="post-header">
          <div className="pfp-container">
            <img
              className="pfp"
              alt="ProfilePic"
              src={
                post.user?.profilePic ||
                "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1380"
              }
            ></img>
          </div>
          <div className="header-content-wrapper">
            <div className="header-content-container">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="header-user">{post.user?.username}</span>
                <span className="spacer">• {timePassed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Carousel
          interval={null}
          prevIcon={<FontAwesomeIcon icon={faCircleArrowLeft} />}
          nextIcon={<FontAwesomeIcon icon={faCircleArrowRight} />}
          wrap={false}
        >
          {post.images.map((i: Image, idx: number) => {
            return (
              <Carousel.Item key={i.id}>
                <img
                  className="post-image"
                  src={i.url}
                  alt={"Image" + idx}
                ></img>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>
      <div>
        <div className="post-controls">
          <div style={{ display: "flex" }}>
            <div className="control">
              <div className="control-icon">
                <FontAwesomeIcon icon={faHeart} />
              </div>
            </div>

            <div className="control">
              <div className="control-icon">
                <FontAwesomeIcon icon={faComment} />
              </div>
            </div>

            <div className="control">
              <div className="control-icon">
                <FontAwesomeIcon icon={faPaperPlane} />
              </div>
            </div>
          </div>

          <FontAwesomeIcon
            style={{
              display: "block",
              marginLeft: "auto",
              width: "24px",
              height: "24px",
            }}
            icon={faBookmark}
          />
        </div>
        <div className="Likes">
          <span style={{ fontWeight: "700", fontSize: "14px" }}>likes</span>
        </div>
        <div className="description">
          <span className="username">{post.user?.username}</span>
          <span className="description-content"> {post.description}</span>
        </div>
        <div>
          {post.comments && post.comments?.length > 0 ? (
            <span style={{ fontSize: "14px", color: "grey" }}>
              View
              {post.comments?.length > 2
                ? ` all ${post.comments?.length} comments`
                : " 1 comment"}{" "}
            </span>
          ) : null}
        </div>
        <div className="input-container">
          <div className="input-wrapper" ref={textareaRef}>
            <textarea
              className="post-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
          </div>
          {comment.length > 0 ? (
            <span style={{ color: "blue", display: "flex" }}>Post</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Post;
