import {connectSocket} from './socketClient/socketClient';
const txtAreaManager = (sender: (packet: string, data: any) => void) => {
    const txtArea = <HTMLTextAreaElement>document.querySelector('.userMsg');
    txtArea.addEventListener('keydown', (e: Event) => {
        const event = e as KeyboardEvent;
        if(event.key === "Enter") {
            if(!event.shiftKey) {
                event.preventDefault();
                let checkAuthor = (<HTMLInputElement>document.querySelector('#username')).value;
                checkAuthor = checkAuthor !== "" ? checkAuthor : "Anonymous";
                const response = {
                    author: checkAuthor,
                    msg: txtArea.value
                };
                sender('message', response);
                txtArea.value = '';
            }
        }
    });
};

const clientUser = connectSocket();
clientUser.registerJSONSender([
    txtAreaManager
]);
clientUser.registerJSONReciever({
    'message': (data) => {
        const container = document.createElement('div');
        container.classList.add('gotMsg');
        container.innerHTML = ` <div><p>${data.author}</p></div>
                                <div><p>${data.msg}</p></div> `;
        const room = <HTMLDivElement>document.querySelector('.room');
        room.appendChild(container);
    }
});