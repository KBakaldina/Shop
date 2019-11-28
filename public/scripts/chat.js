let socket = io('localhost:4430', {autoConnect: false});
let isUp = false;

let name;
let nameMenu = document.getElementById('name-menu');

let errorReason = document.getElementById('error-reason');
let errorSolution = document.getElementById('error-solution');
let errorDiv = document.getElementById('error-div');

let chat = document.getElementById('chat');
let chatTextarea = document.getElementById('chat-textarea');

let msg = document.getElementById('message');

socket.on('name is unique', (data) => {
    name = data.name;

    hide(errorDiv);
    hide(nameMenu);
    chatPopUp();
});

socket.on('name exists', () => {
    errorReason.innerText = 'This name is already used.';
    errorSolution.innerText = 'Choose another one, please!';
    show(errorDiv);
});

socket.on('add new user', (data) => {
    chatTextarea.value += '\n--- ' + data.name + ' JOINED ---';
    scroll();
});

socket.on('add msg', (data) => {
    chatTextarea.value += '\n[' + data.name + ']: ' + data.msg;
    scroll();
});

socket.on('add personal msg', (data) => {
    chatTextarea.value += '\n[' + data.name + ' ONLY FOR YOU]: ' + data.msg;
    scroll();
});

socket.on('del user', (data) => {
    chatTextarea.value += '\n--- ' + data.name + ' LEFT ---';
    scroll();
});

socket.on('disconnect', () => {
    chatTextarea.value +=   '\n----- SERVER DISCONNECTED -----'+
                            '\n----- RELOAD PAGE, PLEASE -----';
    //hide(msg);
    //hide(document.getElementById('send-button'));
});


function chatPicClick() {
    if (isUp) {
        socket.disconnect();

        hide(nameMenu);
        hide(errorDiv);
        hide(chat);

        isUp = false;
    } else {
        socket.connect();

        if (name) chatPopUp();
        else show(nameMenu);

        isUp = true;
    }
}

function checkName() {
    hide(errorDiv);

    let userName = document.getElementById('name').value;
    if (userName) {
        socket.emit('check name', {name: userName});
    } else {
        errorReason.innerText = 'Name field is empty.';
        errorSolution.innerText = 'Enter your name, please!';
        show(errorDiv);
    }
}

function chatPopUp() {
    socket.emit('user in', {name: name});
    show(chat);
    chatTextarea.value = '--- YOU JOINED ---';
}

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

function typing() {
    // show all users that <name> is typing
}

function scroll () {
    chatTextarea.scrollTop = chatTextarea.scrollHeight;
}

function hide(element) {
    element.classList.add('hidden');
}

function show(element) {
    element.classList.remove('hidden');
}