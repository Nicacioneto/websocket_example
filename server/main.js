const webSocketsServerPort = 8000;

const webSocketServer = require('websocket').server;

const http = require('http');

// Spinning the http server and the websocket server.

const server = http.createServer();

server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))


    connection.on('message', function(message){
        if(message.type === 'utf8')
            console.log('Received Message: ', message.utf8Data)

        //broadcasting message to all connected clients

        var date = new Date()

        const target = JSON.parse(message.utf8Data)

        const source = {time: date.setSeconds(date.getSeconds() + 15)}

        const returnedTarget = JSON.stringify(Object.assign(target, source));

        for(key in clients){
            clients[key].sendUTF(returnedTarget)
            console.log('sent Message to: ', clients[key])
        }
    })
});