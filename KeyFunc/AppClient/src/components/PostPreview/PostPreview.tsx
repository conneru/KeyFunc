import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Post } from "../../types";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import PostModal from "../PostModal/PostModal";
import { useState } from "react";

function PostPreview(p: Post) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="single-post">
      <img src={p.images[0].url} alt={"geaderhgtdrheatdh"}></img>
      <div className="overlay" onClick={handleShow}>
        <div style={{ marginRight: "12px" }}>
          <FontAwesomeIcon icon={faHeart} /> {p.likes}
        </div>
        <div>
          <FontAwesomeIcon icon={faComment} /> {p.comments?.length}
        </div>
      </div>

      <PostModal
        show={show}
        handleClose={handleClose}
        activeIndex={activeIndex}
        post={p}
      />
    </div>
  );
}

export default PostPreview;
