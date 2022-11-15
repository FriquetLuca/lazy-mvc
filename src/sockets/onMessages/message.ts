import { LazySocket } from "lazy-toolbox";
import WebSocket from 'ws';
module.exports = (server: LazySocket, socket: WebSocket.WebSocket, data: any, db: any, clientId: number) => {
    const actualTime = new Date();
    let hours = `${actualTime.getHours()}`;
    hours = hours.length == 1 ? `0${hours}` : hours;
    let min = `${actualTime.getMinutes()}`;
    min = min.length == 1 ? `0${min}` : min;
    data.postTime = `${hours}:${min}`;
    server.sendToAll('message', data);
};