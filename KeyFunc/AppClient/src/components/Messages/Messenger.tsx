import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import "./Chat.css";
import { Chat, User } from "../../types";

import { getMessages, viewMsg } from "../../features/chatSlice";
import {
  addTimeCode,
  chatImageDisplay,
  findOtherUsers,
  includePfp,
} from "../../helpers";
import { Message } from "../../types";

interface MessengerType {
  chat: Chat;
  chatId: string;
  setChat: React.Dispatch<React.SetStateAction<Chat | null | undefined>>;
}

function Messenger({ chat, chatId, setChat }: MessengerType) {
  const user = useAppSelector((state) => state.auth.User);
  const lastMsg = useRef<HTMLDivElement>(null);
  const messengerScroll = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState<string>("");
  const [currChat, setCurrChat] = useState<Chat>();
  const [loadingMsg, setLoadMsg] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[] | null>();
  const [otherUsers, setOtherUsers] = useState<User[]>();

  const dispatch = useAppDispatch();

  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 0.99,
  };

  async function getMoreMessages() {
    if (chat.messages?.length && user) {
      await dispatch(
        getMessages({ msg: chat.messages[chat.messages.length - 1], user })
      );
      setStuff();
    }
  }

  async function viewMessage() {
    if (chat.messages?.length && user) {
      await dispatch(viewMsg({ msg: chat.messages[0], user }));
      setStuff();
    }
  }

  function setStuff() {
    // if (currChat?.id !== Number(chatId)) {
    // }
    setCurrChat(chat);

    setMessages(chat?.messages);
    setOtherUsers(findOtherUsers(user, chat));
  }

  useEffect(() => {
    if (currChat?.id !== Number(chatId)) {
      if (messengerScroll.current) {
        messengerScroll.current.scrollTop =
          messengerScroll.current.scrollHeight;
      }
      setMessages(null);
      setCurrChat(chat);
    } else {
      if (
        chat.messages?.length &&
        chat?.messages?.length < 10 &&
        chat.messages[chat.messages?.length - 1].id !== 0
      ) {
        getMoreMessages();
      } else if (
        chat.messages?.length &&
        user?.id &&
        !chat.messages[0].usersWhoHaveRead.includes(user.id)
      ) {
        viewMessage();
      } else {
        setStuff();
      }
    }
  }, [chatId, chat, currChat?.id]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (
          entry.isIntersecting &&
          chat.messages &&
          chat.messages[chat.messages?.length - 1].id !== 0
        ) {
          setLoadMsg(true);
          await getMoreMessages();
          setLoadMsg(false);
        }
      });
    }, options);
    if (lastMsg.current) {
      observer.observe(lastMsg.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [chatId, messages]);
  useEffect(() => {}, [chat, chatId]);

  function sendMessage() {
    console.log("about to send", message);

    dispatch({
      type: "sendMessage",
      payload: {
        event: chat?.name,
        message: {
          Content: message,
          UserId: user?.id,
          ChatId: chat?.id,
        },
        user: { Id: user?.id },
      },
    });

    setMessage("");
  }

  return (
    <div className="messenger">
      <div className="messenger-header">
        <div className="messenger-icon-container">
          <div className="messenger-icon">
            {chatImageDisplay(chat, otherUsers, "34px")}
          </div>
          <div>
            {chat.name ? (
              <span>{chat.name}</span>
            ) : (
              otherUsers?.map((u, idx, a) => {
                if (idx === a.length - 1) {
                  return (
                    <span
                      key={`${u.id}-header-username`}
                    >{`${u.username}`}</span>
                  );
                }
                return (
                  <span
                    key={`${u.id}-header-username`}
                  >{`${u.username},`}</span>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="messenger-container" ref={messengerScroll}>
        {currChat?.id === Number(chatId) && messages
          ? messages?.map((m, idx, arr) => {
              if (m.id !== 0) {
                const timeCode: string | undefined = addTimeCode(
                  m,
                  arr[idx + 1] || null
                );
                const includePic: boolean = includePfp(m, arr[idx - 1] || null);

                return (
                  <div
                    ref={lastMsg}
                    style={{
                      display: "flex",
                      width: "100%",

                      flexDirection: "column",
                      margin: "0px",
                    }}
                    key={`${m.id} + ${idx}`}
                  >
                    {timeCode ? (
                      <div className="timecode">
                        <div>{timeCode}</div>
                      </div>
                    ) : null}
                    <div style={{ display: "flex", width: "100%" }}>
                      {m.user?.id === user?.id ? (
                        <div className="messenger-spacer"></div>
                      ) : null}
                      <div
                        className="message-wrapper"
                        style={{
                          alignSelf:
                            m.user?.id === user?.id ? "flex-end" : "flex-start",
                        }}
                      >
                        {m.user?.id !== user?.id ? (
                          <div className="message-icon-container">
                            {includePic ? (
                              <img
                                className="message-icon"
                                alt={m.user?.username + "PFP"}
                                src={
                                  m.user?.profilePic ||
                                  "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
                                }
                              />
                            ) : null}
                          </div>
                        ) : null}

                        <div
                          className="message-container"
                          style={{
                            backgroundColor:
                              m.user?.id === user?.id ? "#3797f0" : "#efefef",

                            color: m.user?.id === user?.id ? "white" : "black",
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: "pre-line",
                              maxWidth: "564px",
                            }}
                          >
                            {m.content}
                          </div>
                        </div>
                      </div>
                      {m.user?.id !== user?.id ? (
                        <div className="messenger-spacer"></div>
                      ) : null}
                    </div>
                  </div>
                );
              }

              return (
                <div className="messenger-top-container" key={m.id}>
                  <div className="messenger-top">
                    <div
                      style={{
                        paddingTop: "16px",
                        paddingBottom: "16px",
                      }}
                    >
                      <div className="messenger-top-icon">
                        {chatImageDisplay(chat, otherUsers, "72px")}
                      </div>
                    </div>
                    <div>
                      {chat.name ? (
                        <span>{chat.name}</span>
                      ) : (
                        otherUsers?.map((u, idx, a) => {
                          if (idx === a.length - 1) {
                            return (
                              <span
                                key={`${m.id}-${u.id}-username`}
                              >{`${u.username}`}</span>
                            );
                          }
                          return (
                            <span
                              key={`${m.id}-${u.id}-username`}
                            >{`${u.username},`}</span>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div style={{ flexGrow: 1 }}></div>
                </div>
              );
            })
          : null}
      </div>
      <div className=" messenger-input-container">
        <div className="messenger-input">
          <input
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
          />
          {message !== "" ? (
            <span onClick={() => sendMessage()}>Send</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Messenger;
