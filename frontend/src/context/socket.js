import { createContext } from 'react';
import socketio from 'socket.io-client';

export function socket() {
  let sock = socketio.connect(
    `http://${window.location.hostname}:3001`,
  );
  if (process.env.NODE_ENV === 'production') {
    sock = socketio();
  }
  return sock;
}

export const SocketContext = createContext();
