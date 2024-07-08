import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../../hooks";
import { Chat, User, Message } from "../../types";
import "./Chat.css";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  calculateTimeDiff,
  findOtherUsers,
  chatImageDisplay,
} from "../../helpers";

interface ChatList {
  chats: Chat[] | null;
  setChat: React.Dispatch<React.SetStateAction<Chat | null | undefined>>;
}

function ChatList({ chats, setChat }: ChatList) {
  const { chatId } = useParams();
  const user = useAppSelector((state) => state.auth.User);
  const navigate = useNavigate();
  const [reload, setReload] = useState<boolean>(false);

  function lastMessage(chat: Chat) {
    const mostRecentMsg = chat.messages?.[0];

    if (mostRecentMsg) {
      let timeDiff = calculateTimeDiff(mostRecentMsg?.createdAt);
      let b: boolean = false;

      if (user?.id && mostRecentMsg.usersWhoHaveRead.includes(user?.id)) {
        b = true;
      }

      const msgUser =
        mostRecentMsg?.user?.id === user?.id
          ? "You: "
          : mostRecentMsg?.user?.username + ":";

      return (
        <div className="message-preview-container">
          <div
            className="message-preview"
            style={b ? {} : { fontWeight: "bolder", color: "black" }}
          >{`${msgUser} ${mostRecentMsg?.content} `}</div>
          <div className="msg-spacer" style={{ fontSize: "12px" }}>
            • {timeDiff}
          </div>
        </div>
      );
    }

    return (
      <div className="message-preview-container">
        <div className="message-preview">{`Group was created`}</div>
        <div className="msg-spacer" style={{ fontSize: "12px" }}></div>
      </div>
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setReload(!reload);
    }, 1000 * 60);
  }, [reload]);

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-user">{user?.username}</div>
        <div className="create-container">
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
      </div>
      <div className="chatlist-header">
        <div style={{ fontWeight: 700 }}>Messages</div>
      </div>
      <div className="chatlist">
        {chats?.map((c: Chat) => {
          const otherUsers = findOtherUsers(user, c);
          return (
            <div
              className="chatlist-item"
              onClick={() => {
                setChat(c);
                navigate(`/inbox/${c.id}`);
              }}
              key={c.id}
              style={
                chatId == c.id ? { backgroundColor: "rgb(0, 0, 0, 0.05)" } : {}
              }
            >
              <div className="chatlist-item-container">
                <div className="chat-icon-container">
                  <div className="chat-icon">
                    {chatImageDisplay(c, otherUsers, "40px")}
                  </div>
                </div>
                <div className="chat-details">
                  <div>
                    {c.name
                      ? c.name
                      : otherUsers?.map((u, idx) => {
                          if (idx !== otherUsers.length - 1) {
                            return <span>{`${u.username}, `}</span>;
                          }

                          return <span>{u.username}</span>;
                        })}
                  </div>

                  {lastMessage(c)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
