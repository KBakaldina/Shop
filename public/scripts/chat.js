let socket = io('localhost:4430', {autoConnect: false});

let chat = document.getElementById('chat');
let chatTextarea = document.getElementById('chat-textarea');

let msg = document.getElementById('message');
let userName = document.getElementById('script').dataset.src;

socket.on('add new user', (data) => {
    chatTextarea.value += '\n--- ' + data.userName + ' JOINED ---';
});

socket.on('add msg', (data) => {
    chatTextarea.value += '\n[' + data.userName + ']: ' + data.msg;
});

socket.on('del user', (data) => {
    chatTextarea.value += '\n--- ' + data.userName + ' LEFT ---';
});

socket.on('add personal msg', (data) => {
    chatTextarea.value += '\n[[[' + data.userName + ']]]: ' + data.msg;
});

socket.on('scroll', () => {
    scroll();
});

function send() {
    let text = msg.value.trim();
    if (text) {
        let isPersonal = (text.startsWith('@(')) ? true: false;
        if (isPersonal) {
            let to = text.split('@(')[1]
                .split(')')[0];
            text = text.substring(3 + to.length);
            socket.emit('new personal msg', {to: to, msg: text})
            chatTextarea.value += '\n[YOU TO ' + to + ']: ' + text;
        } else {
            socket.emit('new msg', {msg: text});
            chatTextarea.value += '\n[YOU]: ' + text;
        }
        // if user 'to' does not exists ?
    }
    msg.value='';
    scroll();
}

function chatPopUp() {
    if (chat.classList.contains('isHidden')) {
        socket.connect();
        chat.classList.remove("isHidden");
        socket.emit('user in', userName);
        chatTextarea.value = '--- YOU JOINED ---';
    } else {
        socket.disconnect();
        chat.classList.add("isHidden");
    }
}

function scroll () {
    chatTextarea.scrollTop = chatTextarea.scrollHeight;
}

msg.addEventListener('keyup', (event) => {
    let key = event.which || event.keyCode;
    if (key == 13 && !event.shiftKey) // only enter
            send(event);
});

document.getElementById('chat-pic').addEventListener('click', () => {
    chatPopUp();
});