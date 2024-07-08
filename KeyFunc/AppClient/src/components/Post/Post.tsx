import "./Post.css";
import "@fortawesome/fontawesome-svg-core";
import { Carousel, Spinner } from "react-bootstrap";
import { Image as ImageType, Post as PostType } from "../../types";
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
import { useEffect, useRef, useState } from "react";
import NavBar from "../Navbar/NavBar";
import { calculateMinImageDimensions, calculateTimeDiff } from "../../helpers";
import PostModal from "../PostModal/PostModal";
import { useNavigate } from "react-router-dom";

function Post(post: PostType) {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [maxHeight, setMaxHeight] = useState(0);
  const [caroItems, setItems] = useState<JSX.Element[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const textareaRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const handleSelect = (
    selectedIndex: number,
    e: Record<string, unknown> | null
  ) => {
    setActiveIndex(selectedIndex);
  };

  useEffect(() => {
    const calculateMaxHeight = async () => {
      let maxSize = 0;

      for (let i = 0; i < post.images.length; i++) {
        const imgObject = post.images[i];
        const img = new Image();

        await new Promise((resolve) => {
          img.onload = resolve;
          if (imgObject.url) {
            img.src = imgObject.url;
          }
        });

        const { height } = calculateMinImageDimensions(
          img.width,
          img.height,
          470,
          584
        );

        if (height > maxSize) {
          maxSize = height;
        }
      }

      setMaxHeight(maxSize);
    };

    const updateCarouselItems = () => {
      const items = post.images.map((imgObject) => (
        <Carousel.Item key={imgObject.id}>
          <img
            className="post-image"
            src={imgObject.url}
            alt={`fsed ${imgObject.id}`}
          />
        </Carousel.Item>
      ));
      setItems(items);
    };

    calculateMaxHeight();
    updateCarouselItems();
    setIsRendered(true);

    return () => {
      setIsRendered(false);
      setItems([]);
    };
  }, [post.images, calculateMinImageDimensions]);

  let timePassed = calculateTimeDiff(post.createdAt);

  if (!maxHeight) {
    return (
      <div>
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
                <div
                  className="header-content-container"
                  onClick={() => navigate("/register")}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="header-user">{post.user?.username}</span>
                    <span className="spacer">• {timePassed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="c"
            style={{
              height: `584px`,
              width: "470px",
            }}
          ></div>
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
              <span style={{ fontWeight: "700", fontSize: "14px" }}>
                {post.likes ? `${post.likes} likes` : null}
              </span>
            </div>
            <div className="description">
              <span className="username">{post.user?.username}</span>
              <span className="description-content"> {post.description}</span>
            </div>
            <div>
              {post.comments && post.comments?.length > 0 ? (
                <span
                  style={{ fontSize: "14px", color: "grey" }}
                  onClick={handleShow}
                >
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
        <PostModal
          show={show}
          handleClose={handleClose}
          post={post}
          activeIndex={activeIndex}
        />
      </div>
    );
  }

  return (
    <div>
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
                  <span
                    className="header-user"
                    onClick={() => navigate(`/${post.user?.username}`)}
                  >
                    {post.user?.username}
                  </span>
                  <span className="spacer">• {timePassed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="carousel-container"
          style={
            maxHeight
              ? {
                  height: `${maxHeight}px`,
                  width: "470px",
                }
              : { width: "470px" }
          }
        >
          <Carousel
            interval={null}
            prevIcon={<FontAwesomeIcon icon={faCircleArrowLeft} />}
            nextIcon={<FontAwesomeIcon icon={faCircleArrowRight} />}
            wrap={false}
            onSelect={handleSelect}
          >
            {caroItems}
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
            <span style={{ fontWeight: "700", fontSize: "14px" }}>
              {post.likes ? `${post.likes} likes` : null}
            </span>
          </div>
          <div className="description" onClick={handleShow}>
            <span className="username">{post.user?.username}</span>
            <span className="description-content"> {post.description}</span>
          </div>
          <div>
            {post.comments && post.comments?.length > 0 ? (
              <span
                style={{ fontSize: "14px", color: "grey" }}
                onClick={handleShow}
              >
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
      <PostModal
        show={show}
        handleClose={handleClose}
        post={post}
        activeIndex={activeIndex}
      />
    </div>
  );
}

export default Post;
