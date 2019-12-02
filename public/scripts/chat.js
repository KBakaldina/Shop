let socket = io('localhost:4430', {autoConnect: false});
let isUp = false;

let name;
let nameMenu = document.getElementById('name-menu');

let errorReason = document.getElementById('error-reason');
let errorSolution = document.getElementById('error-solution');
let errorDiv = document.getElementById('error-div');

let pictureLink = document.getElementById('script').dataset.src;

let chat = document.getElementById('chat');
let chatArea = document.getElementById('message-list');

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
    displayMsg(null, 'SYSTEM', '--- ' + data.name + ' JOINED---');
});

socket.on('add msg', (data) => {
    displayMsg(data.pictureLink, data.name, data.msg);
});

socket.on('add personal msg', (data) => {
    displayMsg(data.pictureLink,data.name+' [ONLY FOR YOU]', data.msg);
});

socket.on('del user', (data) => {
    displayMsg(null,'SYSTEM', '--- ' + data.name + ' LEFT---');
});

socket.on('disconnect', () => {
    socket.disconnect();
    displayMsg(null,'SYSTEM',
             '----- SERVER DISCONNECTED -----' +
                '\n----- RELOAD PAGE, PLEASE -----');
    hide(msg);
    hide(document.getElementById('send-button'));
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
    displayMsg(null,'SYSTEM', '--- YOU JOINED ---');
}

function send() {
    let text = msg.value.trim();
    if (text) {
        let isPersonal = (text.startsWith('@(')) ? true: false;
        if (isPersonal) {
            let to = text.split('@(')[1]
                .split(')')[0];
            text = text.substring(3 + to.length);

            socket.emit('new personal msg', {to: to, msg: text, pictureLink: pictureLink});

            displayMsg(pictureLink,'YOU [TO '+ to + ']', text);
        } else {
            socket.emit('new msg', {msg: text, pictureLink: pictureLink});
            displayMsg(pictureLink,'YOU', text);
        }
        // if user 'to' does not exists ?
    }
    msg.value='';
}

function typing() {
    // show all users that <name> is typing
}

function scroll () {
    chatArea.scrollTop = chatArea.scrollHeight;
}

function hide(element) {
    element.classList.add('hidden');
}

function show(element) {
    element.classList.remove('hidden');
}

function displayMsg (pictureLink, name, msg) {
    let time = new Date();
    chatArea.innerHTML += '<div>' +
        '<img class="chat-pic" src="'+ pictureLink +'">'+
        '<p>'+ msg +'</p>' +
        '<label>'+ name + ', '+ time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() +'</label>' +
        '</div>';
    scroll();
}