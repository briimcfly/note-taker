const express = require('express');
const path = require('path');
const {readFile, writeFile} = require('fs');

//UUID
const { v4: uuidv4 } = require('uuid');

//Port
const port = 3001;

//New Express App
const app = express();

//Middleware
app.use(express.json());
app.use(express.static('public'));


//GET Requests for Notes
app.get('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to get notes`);
})

//PUT Requests for Notes
app.post('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to get notes`);
})

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})