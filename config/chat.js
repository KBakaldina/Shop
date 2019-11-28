module.exports = (io) => {
    io.on('connection', (socket) => {
        let userName;
        let socketId = socket.request.headers.cookie.split('io=')[1];
        let token = socket.request.headers.cookie.split('token=')[1].split(';')[0];
        console.log('id:'+socketId+'\ntoken:'+token);


        socket.on('user in', async (name) => {
            userName = name;

            socket.broadcast.emit('add new user', {userName: userName});
            socket.broadcast.emit('scroll');
        });

        socket.on('new msg', (data) => {
            socket.broadcast.emit('add msg', {userName: userName, msg: data.msg});
            socket.broadcast.emit('scroll');
        });

        socket.on('new personal msg', async (data) => {
            //join
            //io.to(`${SocketId}`).emit('add personal msg', {userName: userName, msg: data.msg});
        });

        socket.on('disconnect', async() => {
            socket.broadcast.emit('del user', {userName: userName});
            socket.broadcast.emit('scroll');
        });
    });
};