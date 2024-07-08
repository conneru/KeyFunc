import { Carousel, Modal } from "react-bootstrap";
import { Post, Image as ImageType } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import "./PostModal.css";

import { useEffect, useRef, useState } from "react";
import { calculateMinImageDimensions, calculateTimeDiff } from "../../helpers";

interface PostModalProps {
  show: boolean;
  handleClose: Function;
  post: Post;
  activeIndex: number;
}

function PostModal({ show, handleClose, post, activeIndex }: PostModalProps) {
  const [maxWidth, setMaxWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [caroItems, setCaroItems] = useState<JSX.Element[]>([]);
  const [tagWidth, setTagWidth] = useState<number>(0);
  const [showTags, setShowTags] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const [offsetX, setOffsetX] = useState<number>(0);

  function handlePostModalSize() {
    let cWidth = 0;
    let cHeight = 0;

    let carouselItems: JSX.Element[] = [];
    for (let i = 0; i < post.images.length; i++) {
      const imgObject = post.images[i];
      let img = new Image();

      if (imgObject.url) {
        img.src = imgObject.url;
      }

      const { width, height } = calculateMinImageDimensions(
        img.width,
        img.height,
        Math.round(window.innerWidth - 50),
        Math.round(window.innerHeight - 50)
      );

      if (width > cWidth) {
        cWidth = width;
      }

      if (height > cHeight) {
        cHeight = height;
      }

      carouselItems.push(
        <Carousel.Item key={imgObject.id}>
          <div style={{ position: "relative" }}>
            <img
              onClick={() => setShowTags(!showTags)}
              className="img-fluid max-height-100vh "
              src={imgObject.url}
              alt={"Image" + i}
            ></img>
            {imgObject.tags?.map((t) => {
              return (
                <div
                  className={`tag ${showTags ? "visible" : ""}`}
                  style={{
                    // left: `calc(${t.left}% - 80px)`,
                    // top: `calc(${t.top}% + 10px)`,

                    left: `${t.left}%`,
                    top: `${t.top}%`,
                  }}
                  key={t.left + t.top}
                >
                  <div className="arrow-up"></div>
                  <div className="tag-username">{t.username}</div>
                </div>
              );
            })}
          </div>
        </Carousel.Item>
      );

      setMaxHeight(1388);
      setMaxWidth(cWidth);
      setCaroItems(carouselItems);
    }
  }
  useEffect(() => {
    handlePostModalSize();
    window.addEventListener("resize", handlePostModalSize);
  }, [caroItems.length, post.images, maxHeight, maxHeight, show, showTags]);
  return (
    <Modal
      show={show}
      onHide={() => handleClose()}
      dialogClassName="image-carousel-modal"
    >
      <Modal.Body>
        <Modal.Body
          style={
            maxHeight && maxWidth
              ? {
                  maxWidth: "1388px",
                  height: `${maxHeight}px`,
                  width: `${maxWidth}px`,
                  backgroundColor: "#efefef",
                }
              : {}
          }
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center post-modal">
                <Carousel
                  interval={null}
                  prevIcon={<FontAwesomeIcon icon={faCircleArrowLeft} />}
                  nextIcon={<FontAwesomeIcon icon={faCircleArrowRight} />}
                  wrap={false}
                >
                  {caroItems}
                </Carousel>
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className="comment-section">
          <div className="comment-section-header">
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
            <div style={{ fontWeight: "600" }}>{post.user?.username}</div>
          </div>
          <div className="comments">
            {post.description ? (
              <div className="comment">
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
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    maxWidth: "100%",
                    overflowWrap: "anywhere",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "8px",
                      paddingTop: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: ".8rem",
                        fontWeight: "600",
                        marginRight: "8px",
                      }}
                    >
                      {post?.user?.username}
                    </span>
                    <span>{post.description}</span>
                    <div></div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      fontSize: "12px",
                      color: "grey",
                      margin: "8px 0px 4px 8px",
                    }}
                  >
                    {calculateTimeDiff(post.createdAt)}
                  </div>
                </div>
              </div>
            ) : null}
            {post?.comments?.map((c) => {
              let timePassed = calculateTimeDiff(c.createdAt);
              return (
                <div className="comment">
                  <div className="pfp-container">
                    <img
                      className="pfp"
                      alt="ProfilePic"
                      src={
                        c.user?.profilePic ||
                        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1380"
                      }
                    ></img>
                  </div>
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      maxWidth: "100%",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <div
                      style={{
                        marginLeft: "8px",
                        paddingTop: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: ".8rem",
                          fontWeight: "600",
                          marginRight: "8px",
                        }}
                      >
                        {c?.user?.username}
                      </span>
                      <span>{c.content}</span>
                      <div></div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        fontSize: "12px",
                        color: "grey",
                        margin: "8px 0px 4px 8px",
                      }}
                    >
                      {timePassed}
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      alignSelf: "center",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PostModal;
