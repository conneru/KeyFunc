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
import { Spinner } from "react-bootstrap";
import NavBar from "../Navbar/NavBar";

export default function Feed() {
  const dispatch = useAppDispatch();

  const [isRendered, setIsRendered] = useState(false);
  const userAuthExp = useAppSelector((state) => state.auth.authExp);

  useEffect(() => {
    // const id: number = Math.floor(Math.random() * (15 - 13) + 13);
    console.log("from feed");
    dispatch(getFollowingPosts({ id: 13 }));
  }, []);

  const posts: PostType[] | null = useAppSelector((state) => {
    return state.post.Posts;
  });
  const isLoading: boolean = useAppSelector((state) => state.post.isLoading);

  return (
    <div className="feed-wrapper">
      <div className="feed-container">
        {isLoading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <div className="feed">
            {posts?.map((p: PostType) => {
              return <Post key={p.id} {...p} />;
            })}
            <button onClick={() => dispatch(getFollowingPosts({ id: 14 }))}>
              FUCKIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
