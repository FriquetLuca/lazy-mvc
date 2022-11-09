import { LazyClient } from "lazy-toolbox";

const txtAreaManager = (sender: (packet: string, data: any) => void) => {
    const txtArea = document.querySelector('.userMsg');
    txtArea?.addEventListener('keydown', (e: Event) => {
        const event = e as KeyboardEvent;
        if(event.key === "Enter") {
            if(!event.shiftKey) {
                event.preventDefault();
                let checkAuthor = document.querySelector('#username')?.getAttribute('value');
                checkAuthor = checkAuthor !== "" ? checkAuthor : "Anonymous";
                sender('message', {
                    author: checkAuthor,
                    msg: txtArea?.getAttribute('value')
                });
                txtArea?.setAttribute('value', '');
            }
        }
    });
};

const clientUser = new LazyClient("127.0.0.1", 8080);
clientUser.registerJSONSender([
    txtAreaManager
]);

clientUser.registerJSONReciever({
    'message': (data) => {
        const container = document.createElement('div');
        container.classList.add('gotMsg');
        container.innerHTML = ` <div><p>${data.author}</p></div>
                                <div><p>${data.msg}</p></div> `;
        const room = document.querySelector('.room');
        room?.appendChild(container);
    }
});