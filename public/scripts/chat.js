let socket = io('localhost:4430', {autoConnect: false});

let chat = document.getElementById('chat');
let chatButton = document.getElementById('chat-button')
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
    chatTextarea.value += '\n--- ' + data.userName + ' DISCONNECTED ---';
});

function send() {
    socket.emit('new msg', {msg: msg.value});
    chatTextarea.value += '\n[YOU]: ' + msg.value;
    msg.value ='';
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

msg.addEventListener("keypress", (event) => {
    let key = event.which || event.keyCode;
    if (key == 13) //enter
        send(event);
});