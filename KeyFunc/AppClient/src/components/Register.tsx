import { FormEvent, useState } from "react";
import { createUser, deleteUser, updateUser } from "../features/userSlice";
import { useAppDispatch } from "../hooks";
import { Chat, Message, Post, User } from "../types";
import {
  createPost,
  deletePost,
  fetchSinglePost,
  getFollowingPosts,
} from "../features/postSlice";
import {
  createChat,
  deleteChat,
  fetchSingleChat,
  updateChat,
} from "../features/chatSlice";
import { createMessage } from "../features/messageSlice";

export default function Register() {
  const [username, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirm] = useState<string>("");

  const dispatch = useAppDispatch();

  function submitUser(e: FormEvent) {
    e.preventDefault();
    const post: Post = {
      userId: 13,
      description: "lowercasetest",
      images: [
        {
          url: "https://www.operationkindness.org/wp-content/uploads/blog-kitten-nursery-operation-kindness.jpg",
          orderNum: 1,
        },
        {
          orderNum: 3,
          url: "https://www.operationkindness.org/wp-content/uploads/blog-kitten-nursery-operation-kindness.jpg",
        },
        {
          orderNum: 2,
          url: "https://www.operationkindness.org/wp-content/uploads/blog-kitten-nursery-operation-kindness.jpg",
        },
      ],
    };

    const chat: Chat = {
      name: "lowercase test",
      users: [{ id: 5 }, { id: 6 }, { id: 7 }],
    };
    const message: Message = {
      userId: 5,
      content: "good job!!!!",
      chatId: 2,
    };
    const user: User = {
      username: username,
      email: email,
    };
    // dispatch(deleteUser({ Id: 9 }));
    // dispatch(createUser(user));
    // dispatch(updateUser(user));
    // dispatch(fetchSinglePost(5));
    // dispatch(getFollowingPosts({ Id: 13 }));
    dispatch(createPost(post));
    // dispatch(deletePost({ Id: 3 }));
    dispatch(createChat(chat));
    // dispatch(deleteChat({ Id: 1 }));
    // dispatch(updateChat({ Id: 2, Name: username }));
    // dispatch(fetchSingleChat(2));
    // dispatch(createMessage(message));
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form style={{ width: 400 }} onSubmit={(e) => submitUser(e)}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            value={username}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            value={confirmPass}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <button className="btn btn-success">Submit</button>
        <div>
          <a href="login">Already have an account?</a>
        </div>
      </form>
    </div>
  );
}
