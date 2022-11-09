import { LazySocket } from "lazy-toolbox";
import WebSocket from 'ws';
module.exports = (server: LazySocket, socket: WebSocket.WebSocket, data: any, db: any) => {
    console.log("Received message !");
};