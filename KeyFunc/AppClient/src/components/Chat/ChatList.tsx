import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calculateTimeDiff, useAppSelector } from "../../hooks";
import { Chat } from "../../types";
import "./Chat.css";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

interface ChatList {
  chats: Chat[] | null;
}

function ChatList({ chats }: ChatList) {
  const user = useAppSelector((state) => state.auth.User);

  function lastMessage(chat: Chat) {
    const mostRecentMsg = chat.messages?.[chat.messages.length - 1];

    const timeDiff = calculateTimeDiff(mostRecentMsg?.createdAt);

    const msgUser =
      mostRecentMsg?.user?.id === user?.id
        ? "You: "
        : mostRecentMsg?.user?.username + ":";

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          fontSize: "12px",
          color: "rgb(148, 140, 140)",
        }}
      >
        <span>{`${msgUser} ${mostRecentMsg?.content}`}</span>
        <span className="spacer" style={{ fontSize: "12px" }}>
          • {timeDiff}
        </span>
      </div>
    );
  }

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
        {chats?.map((c: Chat) => (
          <div className="chatlist-item">
            <div className="chatlist-item-container">
              <div className="chat-icon-container">
                <div className="chat-icon">
                  <span>
                    <img
                      src={
                        c.users?.[0]?.profilePic ||
                        "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_3x2.jpg?w=1638&h=1092"
                      }
                      alt={`${c.id}-icon`}
                    />
                  </span>
                </div>
              </div>
              <div className="chat-details">
                <div>{c.name}</div>

                <div>{lastMessage(c)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
