import { createContext } from 'react';
import socketio from 'socket.io-client';

export const socket = socketio.io();

export const SocketContext = createContext();
