"use client";

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
  const pingCount = useRef(0);

  useEffect(() => {
    if (isServer) return;

    if (!loggedIn.current && !unauthorized.current) {
      socket.emit("login");
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
      if (pingCount.current > 10) {
        unauthorized.current = true;
        return;
      }
      socket.disconnect();
      socket.connect();

      setTimeout(() => {
        socket.emit("login");
        pingCount.current += 1;
      }, 1000);
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
  }, [isServer]);

  async function login() {
    socket.disconnect();
    socket.connect();
    unauthorized.current = false;
    loggedIn.current = false;
    socket.emit("login");
  }

  function logout() {
    if (!loggedOut.current) {
      pingCount.current = 0;
      socket.emit("logout");
    }
  }

  return (
    <TimeLogContext.Provider value={{ time, login, logout }}>
      {children}
    </TimeLogContext.Provider>
  );
};

export default TimeLogProvider;
