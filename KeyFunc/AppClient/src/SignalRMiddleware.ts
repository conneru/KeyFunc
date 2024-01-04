import * as signalR from "@microsoft/signalr";
import { Middleware } from "redux";
import { unauthorizeUser } from "./features/userSlice";
import { refresh } from "./features/authSlice";
import { store } from "./store";

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
connection.on("messageReceived", (message) => {
  console.log(message);
});

const signalRMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    const { user } = getState();
    if (connection.state === "Disconnected" && user.isAuthorized) {
      console.log(action.type);
      await connection.start();
      await connection.invoke("JoinGroup").catch((e) => {
        dispatch(unauthorizeUser());
        store.dispatch(refresh());
      });
    }
    switch (action.type) {
      case "sendMessage": {
        console.log("SENDING THIS MESSAGE");
        const message = action.payload.payload.message;
        await connection.invoke("NewMessage", message, "new@gmail.com");
        return next(action);
      }
      default:
        return next(action);
    }
  };

export default signalRMiddleware;
