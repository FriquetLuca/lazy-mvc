import { LazyClientSocket, LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, client: LazyClientSocket, db: any) => {
    const liveDB = server.getData('liveDB');
    const userMap = server.getData('userMap');
    if(userMap && client && userMap[client.ID]) {
        delete liveDB[userMap[client.ID]];
        delete userMap[client.ID];
    }
};