const express = require('express');
const server = express();
const expressRouter = require('./expressRouter.js')

server.use(express.json());
server.use('/api/posts', expressRouter);

server.get('/', (req, res) => {
    res.send(`
        <h2>Post API<h2>
        <p>Welcome!<p>
    `);
});



module.exports = server;