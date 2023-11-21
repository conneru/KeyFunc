import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getFollowingPosts } from "../features/postSlice";
import { Post } from "../types";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFollowingPosts({ id: 13 }));
  }, [dispatch]);

  const posts: Post[] | null = useAppSelector((state) => {
    console.log(state.post);
    return state.post.Posts;
  });
  const isLoading: boolean = useAppSelector((state) => state.post.isLoading);
  if (isLoading) {
    return <div> Loading....</div>;
  }

  return (
    <div>
      <>
        {posts?.map((post) => {
          return (
            <div>
              <div>{post.user?.username}</div>
              <img
                src={post.images?.[0].url}
                style={{ width: "100px", height: "100px" }}
                alt="kitten"
              />
              <div>{post.description}</div>
              <div>Comments:</div>
              {post.comments?.map((comment) => {
                return (
                  <div>
                    <div>
                      {comment.user?.username}: {comment.content}
                    </div>
                  </div>
                );
              })}
              <br />
            </div>
          );
        })}
      </>
    </div>
  );
}
