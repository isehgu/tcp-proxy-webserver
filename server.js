const net = require('net');
const express = require('express');
const PORT = process.env.PORT || 1337;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const TCPHOST = '127.0.0.1';
const TCPPORT = '5000';

let request = 0;
let client = undefined;
let dataStore = [];

app.listen(PORT, (req,res)=> {
    console.log(`listening on ${PORT}`);
    client = net.createConnection({ host: TCPHOST, port: TCPPORT }, () => {
        console.log(`Connected to server ${TCPHOST}:${TCPPORT}`);
    });

    client.on('data', (data) => {
        console.log(`Server data -- ${data.toString()}`);

        dataStore.push(data.toString());
    });
});

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    client.write(`Request ${++request} : Hello World`);
    setTimeout(() => {
        // TBD -- how to ensure the return data is for this request

        if (dataStore.length > 0) res.send(dataStore.pop());
        else res.send('No response yet');
    }, 100);
});
// // static middleware
// app.use(express.static(path.join(__dirname, 'node_modules')));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// // api routing
// app.use('/api', require('./server/api'))

// // send index html page
// app.use('*', (req, res, next) =>
//   res.sendFile(path.join(__dirname, './public/index.html'))
// )

// error handling endware
app.use((err, req, res, next) =>
  res.status(err.status || 500).send(err.message || 'Internal server error.')
);
