import { createContext } from 'react';
import socketio from 'socket.io-client';

export function socket() {
  let sock = socketio.connect(
    `http://${window.location.hostname}:5000`,
  );
  if (process.env.NODE_ENV === 'production') {
    sock = socketio.connect(process.env.PORT);
  }
  return sock;
}

export const SocketContext = createContext();
