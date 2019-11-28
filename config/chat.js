const queryPromise = require('../libs/dbConnection');

module.exports = (io) => {
    io.on('connection', (socket) => {
        let name;
        let socketId = socket.request.headers.cookie.split('io=')[1];
        let token = socket.request.headers.cookie.split('token=')[1].split(';')[0];

        socket.on('check name', (data) => {

            let nameIsOk=true;
            // check name
            if (nameIsOk) {
                socket.emit('name is unique', {name: data.name});
            } else socket.emit('name exists');
        });

        socket.on('user in', (data) => {
            name = data.name;
            socket.broadcast.emit('add new user', {name: name});
        });

        socket.on('new msg', (data) => {
            socket.broadcast.emit('add msg', {name: name, msg: data.msg});
        });

        socket.on('new personal msg', (data) => {
            //join
            //io.to(`${SocketId}`).emit('add personal msg', {name: data.name, msg: data.msg});
        });

        socket.on('disconnect', async() => {
            socket.broadcast.emit('del user', {name: name});
        });
    });
};