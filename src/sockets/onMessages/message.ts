import { LazyClientSocket, LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, socket: LazyClientSocket, data: any, db: any) => {
    const actualTime = new Date();
    let hours = `${actualTime.getHours()}`;
    hours = hours.length == 1 ? `0${hours}` : hours;
    let min = `${actualTime.getMinutes()}`;
    min = min.length == 1 ? `0${min}` : min;
    data.postTime = `${hours}:${min}`;
    server.sendToAll('message', data);
};