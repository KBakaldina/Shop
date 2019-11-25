const express = require('express');
const router = express.Router();
const passport = require('passport');

const http = require('http').createServer(express());
const io = require('socket.io').listen(http);

http.listen(4430);

io.on('connection', (socket) => {
    socket.on('user in', (name) => {
        socket.broadcast.emit('add new user', name);
    });

    socket.on('new msg', (data) => {
        socket.broadcast.emit('add msg', data);
    });

    socket.on('disconnect', (name) => {
        socket.broadcast.emit('user out', name);
    });
});

router.get('/', (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (user == false && err === null) return res.redirect('login');
        if (user) res.render('chat', {pageName: 'Chat', userName: user.userName});
        else return res.render('error', {message: 'Wow! Something\'s wrong...', error: err});
    })(req, res);
});

module.exports = router;