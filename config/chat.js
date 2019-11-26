const queryPromise = require('../libs/dbConnection').queryPromise;

module.exports = (io) => {
    io.on('connection', (socket) => {
        let userName;

        socket.on('user in', async (name) => {
            userName = name;
            await queryPromise('INSERT INTO chat(id, name) VALUES (?, ?)', [socket.id, userName]);
            socket.broadcast.emit('add new user', {userName: userName});
            socket.broadcast.emit('scroll');
        });

        socket.on('new msg', (data) => {
            socket.broadcast.emit('add msg', {userName: userName, msg: data.msg});
            socket.broadcast.emit('scroll');
        });

        socket.on('new personal msg', async (data) => {
            let rows = await queryPromise('SELECT * FROM chat WHERE name=?', [data.to]);
            let toId = rows[0].id;
            io.to(`${toId}`).emit('add personal msg', {userName: userName, msg: data.msg});
        });

        socket.on('disconnect', async() => {
            await queryPromise('DELETE FROM chat WHERE id=?', [socket.id]);
            socket.broadcast.emit('del user', {userName: userName});
            socket.broadcast.emit('scroll');
        });
    });
};