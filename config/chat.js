module.exports = (io) => {
    io.on('connection', (socket) => {
        let userName;

        socket.on('user in', (name) => {
            userName = name;
            socket.broadcast.emit('add new user', {userName: userName});
        });

        socket.on('new msg', (data) => {
            socket.broadcast.emit('add msg', {userName: userName, msg: data.msg});
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit('del user', {userName: userName});
        });
    });
};