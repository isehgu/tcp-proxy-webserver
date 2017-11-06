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



// This is tested with a response, and without a response from server
// by modifying timeout to a very small number.
// Error is correctly thrown.
function getServerResponse(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (dataStore.length > 0) {
                resolve(dataStore.pop());
            } else {
                reject(new Error('No response from server received for your request'));
            }
        }, timeout);
    }); // End of promise
}

app.get('/', (req, res, next) => {
    client.write(`Request ${++request} : Hello World`);
    getServerResponse(100)
        .then(response => {
            res.send(response);
        })
        .catch(next);
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
