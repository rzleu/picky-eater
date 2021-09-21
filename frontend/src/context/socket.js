import { createContext } from 'react';
import socketio from 'socket.io-client';

export const socket = socketio.connect(
  `http://${window.location.hostname}:3001`,
);
export const SocketContext = createContext();
