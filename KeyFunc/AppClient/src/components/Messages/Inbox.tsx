import { useState, useEffect, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import NavBar from "../Navbar/NavBar";
import "./Chat.css";
import ChatList from "./ChatList";
import { Chat as ChatType } from "../../types";
import Messenger from "./Messenger";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function Inbox() {
  const { chatId } = useParams();
  const chats = useAppSelector((state) => state.chat.Chats);
  const [currChat, setCurrChat] = useState<ChatType | null | undefined>(null);
  const dispatch = useAppDispatch();
  const [isRendered, setIsRendered] = useState<ChatType | null | undefined>(
    null
  );

  useEffect(() => {
    if (chats && chatId) {
      setCurrChat(chats.find((c) => c.id === Number(chatId)));
      setIsRendered(currChat);
    }
  }, [chats, currChat]);

  return (
    <div
      style={{
        display: "flex",
        width: "100% ",
        height: "100dvh",
      }}
    >
      <ChatList chats={chats} setChat={setCurrChat} />

      {currChat && chatId && currChat.id === Number(chatId) ? (
        <Messenger chat={currChat} chatId={chatId} setChat={setCurrChat} />
      ) : null}
    </div>
  );
}

export default Inbox;
