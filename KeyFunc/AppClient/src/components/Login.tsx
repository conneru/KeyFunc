import { FormEvent, useEffect, useState } from "react";
import { createUser, deleteUser, updateUser } from "../features/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Chat, Message, NewUser, Post, User } from "../types";
import { createPost, deletePost, fetchSinglePost } from "../features/postSlice";
import {
  createChat,
  deleteChat,
  fetchSingleChat,
  updateChat,
} from "../features/chatSlice";
import { createMessage } from "../features/messageSlice";
import { login } from "../features/authSlice";
import { redirect, Navigate, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.persist.User);

  const dispatch = useAppDispatch();

  async function submitUser(e: FormEvent) {
    e.preventDefault();
    const user: NewUser = { email, password };
    dispatch(login(user)).then(() => navigate("/"));
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
        <button className="btn btn-success" type="submit">
          Submit
        </button>
        <div>
          <a onClick={() => dispatch(fetchSingleChat(2))}>
            Don't have an account?
          </a>
        </div>
      </form>
    </div>
  );
}
