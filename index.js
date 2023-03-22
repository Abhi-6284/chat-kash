// const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const port = 9846;
const http = require('http').Server(app)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
    // console.log(res.render);
    // res.redirect('/index')
    res.render('chat', {
        title: 'Welcome'
    })
})

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
})
const users = {};

io.on('connection',socket => {
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name:  users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left',  users[socket.id] );
        delete users[socket.id];
    });
});

http.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})