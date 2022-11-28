import { LazyClientSocket, LazySocket } from "lazy-toolbox";
let isChecked = false;
const checkClientMap = (server: LazySocket) => {
    if(!isChecked) {
        const userMap = server.getData('userMap');
        if(!userMap) {
            const newMaps: {[label: number]: any} = {};
            server.setData('userMap', newMaps);
        }
    }
    isChecked = true;
}
module.exports = (server: LazySocket, client: LazyClientSocket, db: any) => {
    // Check that our user maps are defined when the first connection to our server happened !
    // It will skip the check for all the others since it should be defined after that anyway.
    checkClientMap(server);
    // Get the userMap to check if our client got a disconnection or is newly connected.
    const userMap = server.getData('userMap');
    if(userMap[client.ID]) {

    } else {
        
    }
};
