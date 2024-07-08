import * as signalR from "@microsoft/signalr";
import { Middleware } from "redux";
import { unauthorizeUser } from "./features/userSlice";
import { refresh } from "./features/authSlice";
import { store } from "./store";
import { Message } from "./types";
import { addMsg } from "./features/chatSlice";

const URL = process.env.HUB_ADDRESS ?? "/hub"; //or whatever your backend port is

const connection = new signalR.HubConnectionBuilder()
  .withUrl(URL, {
    withCredentials: true,

    transport: signalR.HttpTransportType.LongPolling,
  })
  .configureLogging(signalR.LogLevel.Debug)
  .build();
connection.onclose((error) => {
  console.log("Connection closed due to an error:", error);
  // Perform error handling or attempt reconnection logic here...
});
connection.on("messageReceived", (message: Message) => {
  console.log(message);
  store.dispatch(addMsg(message));
});

const signalRMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    const { user } = getState();
    console.log(action.type);
    if (connection.state === "Disconnected" && user.isAuthorized) {
      await connection.start();
      await connection.invoke("JoinGroup").catch((e) => {
        dispatch(unauthorizeUser());
        store.dispatch(refresh());
      });
    }

    switch (action.type) {
      case "sendMessage": {
        console.log("SENDING THIS MESSAGE", action.payload);

        await connection
          .invoke(
            "SendMessage",
            action.payload.message,
            action.payload.user,
            action.payload.event
          )
          .catch(() => {
            store.dispatch(refresh());
          });
        return next(action);
      }
      case "viewedMessages": {
        await connection
          .invoke(
            "ViewedMessages",
            action.payload.chat,
            action.payload.user,
            action.payload.event
          )
          .catch(() => {
            store.dispatch(refresh());
          });
        return next(action);
      }
      default:
        return next(action);
    }
  };

export default signalRMiddleware;
