"use client";

import {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

export const TimeLogContext = createContext({
  time: 0,
  login: () => {},
  logout: () => {},
});

const socket = io(process.env.ENDPOINT as string, {
  withCredentials: true,
});

const TimeLogProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [time, setTime] = useState(0);

  const loggedIn = useRef(false);
  const loggedOut = useRef(true);
  const unauthorized = useRef(false);

  const pingLogin = () => {
    socket.emit("login");
    if (unauthorized.current || loggedIn.current) return;
    setTimeout(pingLogin, 1000);
  };

  useEffect(() => {
    if (!loggedIn.current && !unauthorized.current) {
      pingLogin();
    }

    socket.on("loggedIn", () => {
      loggedIn.current = true;
      loggedOut.current = false;
      unauthorized.current = false;
    });
    socket.on("loggedOut", () => {
      loggedIn.current = false;
      loggedOut.current = true;
      unauthorized.current = true;
    });
    socket.on("unauthorized", () => {
      unauthorized.current = true;
    });

    socket.on("time", (time: string) => {
      setTime(Number(time));
    });

    return () => {
      socket.off("loggedIn");
      socket.off("loggedOut");
      socket.off("unauthorized");
      socket.off("time");

      loggedIn.current = false;
    };
  }, []);

  async function login() {
    await socket.disconnect();
    await socket.connect();
    unauthorized.current = false;
    loggedIn.current = false;
    pingLogin();
  }

  function logout() {
    if (!loggedOut.current) socket.emit("logout");
  }

  return (
    <TimeLogContext.Provider value={{ time, login, logout }}>
      {children}
    </TimeLogContext.Provider>
  );
};

export default TimeLogProvider;
