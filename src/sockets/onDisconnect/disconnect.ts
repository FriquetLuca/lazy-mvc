import { LazySocket } from "lazy-toolbox";
import WebSocket from 'ws';
module.exports = (server: LazySocket, socket: WebSocket.WebSocket, db: any) => {
    console.log("Disconnect module !");
};