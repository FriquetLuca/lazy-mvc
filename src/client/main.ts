import {connectSocket} from './socketClient/socketClient';
const actualUser = {
    username: "Anonymous"
};
const txtArea = <HTMLTextAreaElement>document.querySelector('.userMsg');
const loginModal = <HTMLDialogElement>document.getElementById('login_modal');
const connectModal = <HTMLButtonElement>document.querySelector('.modal_connect');
const username = <HTMLInputElement>document.getElementById('username');
const room = <HTMLDivElement>document.querySelector('.room');

const modalCheck = (): boolean => {
    let initializeModal = false;
    const getUser = sessionStorage.getItem("username");
    if(typeof getUser !== 'string') {
        initializeModal = true;
    } else {
        actualUser.username = getUser;
    }
    return initializeModal;
};
const txtAreaManager = (sender: (packet: string, data: any) => void) => {
    txtArea.addEventListener('keydown', (e: Event) => {
        const event = e as KeyboardEvent;
        if(event.key === "Enter") {
            if(!event.shiftKey) {
                event.preventDefault();
                const response = {
                    author: actualUser.username,
                    msg: txtArea.value
                };
                console.log("You send: " + response.msg);
                sender('message', response);
                txtArea.value = '';
            }
        }
    });
};
const login = (sender: (packet: string, data: any) => void) => {
    if (typeof loginModal.showModal !== 'function') {
        loginModal.hidden = true;
        /* a fallback script to allow this dialog/form to function
           for legacy browsers that do not support <dialog>
           could be provided here.
        */
    } else if(modalCheck()) {
        loginModal.showModal();
        connectModal.addEventListener('click', async () => {
            actualUser.username = username.value;
            sender('login', {
                username: actualUser.username
            });
        })
    } else {
        loginModal.hidden = true;
    }
};

const clientUser = connectSocket();
clientUser.senders(
    txtAreaManager,
    login
);
clientUser.hook('message', (obj: any, websocket: WebSocket) => {
    console.log(`obj is: ${JSON.stringify(obj)}`)
});
clientUser.hookObject({
    'message': (data) => {
        const container = document.createElement('div');
        container.classList.add('gotMsg');
        container.innerHTML = `
        <div>
            <p class="author"><span class="user">${data.author}</span> <span class="message_time">- ${data.postTime}</span></p>
            <p class="message_content">${data.msg}</p>
        </div>`;
        room.appendChild(container);
    },
    'login': (data) => {
        if(data.isAvailable) {
            sessionStorage.setItem("username", actualUser.username);
        } else {
            const errMsg = <HTMLElement>document.querySelector("p[name='username']");
            errMsg.innerText = 'This username is already taken.';
            loginModal.showModal();
        }
    }
});
clientUser.start();