import { LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, clientID: number, db: any) => {
    const liveDB = server.getData('liveDB');
    const userMap = server.getData('userMap');
    delete liveDB[userMap[clientID]];
    delete userMap[clientID];
};