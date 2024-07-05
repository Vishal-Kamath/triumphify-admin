"use client";

import { User } from "@/@types/user";
import { isServer } from "@tanstack/react-query";
import {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

export interface ConversationWithLastMessageAndUser extends Conversation {
  lastMessage: Message;
  user: User;
}

interface SocketContextType {
  messages: Message[];
  conversations: ConversationWithLastMessageAndUser[];
  login: VoidFunction;
  logout: VoidFunction;
  newChat: (msg: string, room: string, cb: Function) => void;
  chatUpdate: (room: string) => void;
  getConversationsList: VoidFunction;
  getRoom: (room: string, cb: Function) => void;
  terminateChat: (room: string, cb: Function) => void;
}
export const Socket = createContext<SocketContextType>({
  messages: [],
  conversations: [],

  login: () => {},
  logout: () => {},

  newChat: (msg: string, room: string, cb: Function) => {},
  chatUpdate: (room: string) => {},
  getConversationsList: () => {},
  getRoom: (room: string, cb: Function) => {},
  terminateChat: (room: string, cb: Function) => {},
});

const socket = io(process.env.WS_WEBSITE as string, {
  withCredentials: true,
});

const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const loggedIn = useRef(false);
  const loggedOut = useRef(true);
  const unauthorized = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<
    ConversationWithLastMessageAndUser[]
  >([]);

  const pingLogin = () => {
    socket.emit("login-admin");
    if (unauthorized.current || loggedIn.current) return;
    setTimeout(pingLogin, 1000);
  };

  useEffect(() => {
    if (isServer) return;

    if (!loggedIn.current && !unauthorized.current) {
      pingLogin();
    }

    socket.on("loggedIn", () => {
      loggedIn.current = true;
      loggedOut.current = false;
      unauthorized.current = false;

      getConversationsList();
    });
    socket.on("loggedOut", () => {
      loggedIn.current = false;
      loggedOut.current = true;
      unauthorized.current = true;

      setMessages([]);
      setConversations([]);
    });
    socket.on("unauthorized", () => {
      unauthorized.current = true;
    });

    socket.on("chat-updated", (room: string) => {
      chatUpdate(room);
      getConversationsList();
    });

    return () => {
      socket.off("loggedIn");
      socket.off("loggedOut");
      socket.off("unauthorized");
      socket.off("chat-updated");

      loggedIn.current = false;
    };
  }, [isServer]);

  async function login() {
    console.log("called");
    await socket.disconnect();
    await socket.connect();
    unauthorized.current = false;
    loggedIn.current = false;
    pingLogin();
  }

  function logout() {
    if (!loggedOut.current) socket.emit("logout");
  }

  function newChat(msg: string, room: string, cb: Function) {
    socket.emit("new-chat-admin", msg, room, cb);
  }

  function chatUpdate(room: string) {
    socket.emit("update-chat-admin", room, setMessages);
  }

  function getConversationsList() {
    socket.emit("get-conversations-admin", setConversations);
  }

  function getRoom(room: string, cb: Function) {
    socket.emit("get-room-admin", room, cb);
  }

  function terminateChat(room: string, cb: Function) {
    socket.emit("terminate-chat-admin", room, cb);
  }

  return (
    <Socket.Provider
      value={{
        messages,
        conversations,
        login,
        logout,
        newChat,
        chatUpdate,
        getConversationsList,
        getRoom,
        terminateChat,
      }}
    >
      {children}
    </Socket.Provider>
  );
};

export default SocketProvider;
