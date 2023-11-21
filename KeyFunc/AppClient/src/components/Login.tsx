import { FormEvent, useState } from "react";
import { createUser, deleteUser, updateUser } from "../features/userSlice";
import { useAppDispatch } from "../hooks";
import { Chat, Message, Post, User } from "../types";
import { createPost, deletePost, fetchSinglePost } from "../features/postSlice";
import {
  createChat,
  deleteChat,
  fetchSingleChat,
  updateChat,
} from "../features/chatSlice";
import { createMessage } from "../features/messageSlice";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useAppDispatch();

  function submitUser(e: FormEvent) {
    e.preventDefault();
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
        <button className="btn btn-success">Submit</button>
        <div>
          <a href="register">Don't have an account?</a>
        </div>
      </form>
    </div>
  );
}
