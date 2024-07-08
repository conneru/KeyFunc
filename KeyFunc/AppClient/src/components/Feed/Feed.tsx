import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getFollowingPosts } from "../../features/postSlice";
import { Post as PostType } from "../../types";
import { logOut, refresh } from "../../features/authSlice";
import Post from "../Post/Post";
import "./Feed.css";
import "../Navbar/NavBar.css";
import { Modal, Spinner } from "react-bootstrap";
import PostModal from "../PostModal/PostModal";

export default function Feed() {
  const dispatch = useAppDispatch();

  const [isRendered, setIsRendered] = useState(false);
  const userAuthExp = useAppSelector((state) => state.auth.authExp);
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const posts: PostType[] | null = useAppSelector((state) => {
    return state.post.Posts;
  });
  const isLoading: boolean = useAppSelector((state) => state.post.isLoading);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getFollowingPosts({ id: 13, following: [], followers: [] })
      );
    };

    if (!posts?.length) {
      fetchData();
    }
  }, [dispatch]);

  if (isLoading || !posts) {
    // Return a loading spinner or placeholder while the posts are being fetched
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className="feed-fix">
      <div className="feed-wrapper">
        <div className="feed-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="feed">
              {posts?.map((p: PostType) => {
                return <Post key={p.id} {...p} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
