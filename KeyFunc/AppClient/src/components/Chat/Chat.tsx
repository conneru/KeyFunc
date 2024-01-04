import { useState, useEffect, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import NavBar from "../Navbar/NavBar";
import "./Chat.css";
import ChatList from "./ChatList";

function Chat() {
  const chats = useAppSelector((state) => state.chat.Chats);
  const dispatch = useAppDispatch();

  useEffect(() => {}, []);

  return (
    <>
      <ChatList chats={chats} />
    </>
  );
}

export default Chat;
