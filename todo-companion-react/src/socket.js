import io from 'socket.io-client';

const socket = io.connect("http://localhost:9000",{
        transport:['websocket']
    });

export {socket};