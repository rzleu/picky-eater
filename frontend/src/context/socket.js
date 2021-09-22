import { createContext } from 'react';
import socketio from 'socket.io-client';

// export function socket() {
//   let sock;
//   console.log('hoo'.process.env.NODE_ENV);
//   if (process.env.NODE_ENV === 'production') {
//     sock = socketio.connect(process.env.PORT);
//   } else {
//     sock = socketio.connect(
//       `http://${window.location.hostname}:5000`,
//     );
//   }
//   return socketio.io;
// }
const path =
  process.env.NODE_ENV === 'production'
    ? `http://${window.location.hostname}:${process.env.PORT}`
    : `${window.location.hostname}:5000`;

export const socket = socketio.io();
export const SocketContext = createContext();
