var mySocketHelper = {
    ioServer:null, 
    connect: function (server) { 
        var io = require('socket.io')(server);
        io.on('connection', function (socket) {
            console.log('someone connected');
            //here we can send recieve data
          //  socket.emit('msg', "welcome!!!!!");
            socket.on('msgClient', (data) => {
                console.log(data);
            })
        });
        server.listen(8888);
        this.ioServer=io;
    } 


}

module.exports= mySocketHelper;