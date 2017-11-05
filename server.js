const net = require('net');

const HOST = '127.0.0.1';
const PORT = '5000';

const client = net.createConnection({ host: HOST, port: PORT }, () => {
    console.log(`Connected to server ${HOST}:${PORT}`);

});

client.write('Hello World');

client.on('data', (data) => {
    console.log(`Server data -- ${data.toString()}`);
});

client.on('end', () => {
  console.log('disconnected from server');
});
