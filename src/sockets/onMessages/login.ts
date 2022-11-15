import { LazySocket } from "lazy-toolbox";
import WebSocket from 'ws';
module.exports = (server: LazySocket, socket: WebSocket.WebSocket, data: any, db: any, clientId: number) => {
    const socketLiveDB = server.getData('liveDB');
    let available = true;
    if(socketLiveDB !== undefined) {
        const user = socketLiveDB[data.username];
        if(user !== undefined) {
            available = false;
        } else {
            socketLiveDB[data.username] = { id: clientId };
            const maps = server.getData('userMap');
            maps[clientId] = data.username;
        }
    } else {
        const newDB: {[label: string]: any} = {};
        newDB[data.username] = { id: clientId };
        server.setData('liveDB', newDB);

        const newMaps: {[label: number]: any} = {};
        newMaps[clientId] = data.username;
        server.setData('userMap', newMaps);
    }
    LazySocket.sendToClient('login', socket, { isAvailable: available });
};