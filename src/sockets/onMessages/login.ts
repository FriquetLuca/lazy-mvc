import { LazyClientSocket, LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, client: LazyClientSocket, data: any, db: any) => {
    const socketLiveDB = server.getData('liveDB');
    let available = true;
    if(socketLiveDB !== undefined) {
        const user = socketLiveDB[data.username];
        if(user !== undefined) {
            available = false;
        } else {
            socketLiveDB[data.username] = { id: client.ID };
            const maps = server.getData('userMap');
            maps[client.ID] = data.username;
        }
    } else {
        const newDB: {[label: string]: any} = {};
        newDB[data.username] = { id: client.ID };
        server.setData('liveDB', newDB);

        const newMaps: {[label: number]: any} = {};
        newMaps[client.ID] = data.username;
        server.setData('userMap', newMaps);
    }
    for(let socket of client.Sockets) {
        LazySocket.sendToClient('login', socket, { isAvailable: available });
    }
};