import { useState, useEffect, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import NavBar from "../Navbar/NavBar";
import "./Chat.css";
import ChatList from "./ChatList";
import { Chat } from "../../types";

interface Message {
  Chat: Chat;
}

function Message({ Chat }: Message) {
  const [message, setMessage] = useState<string>("");
  const messages = Chat.messages;
  const dispatch = useAppDispatch();

  useEffect(() => {}, []);

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    console.log("about to send", message);
    dispatch({
      type: "sendMessage",
      payload: {
        event: "newMessage",
        payload: { message },
      },
    });

    setMessage("");
  }

  return (
    <div>
      {messages?.map((m) => {
        return (
          <div>
            <div></div>
          </div>
        );
      })}
      <form style={{ width: 400 }} onSubmit={(e) => sendMessage(e)}>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Message;
