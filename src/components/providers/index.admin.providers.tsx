import { FC } from "react";
import ReactQueryProvider from "./reactquery.provider";
import FullScreenProvider from "./fullscreen.provider";
import RedirectProvider from "./redirect.provider";
import TimeLogProvider from "./time.log.provider";
import SocketProvider from "./socket.provider";

const AdminProviders: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReactQueryProvider>
    <FullScreenProvider>
      <RedirectProvider>
        <TimeLogProvider>
          <SocketProvider>{children}</SocketProvider>
        </TimeLogProvider>
      </RedirectProvider>
    </FullScreenProvider>
  </ReactQueryProvider>
);

export default AdminProviders;
