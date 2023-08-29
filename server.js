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

    //Destructure req.body
    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            noteID: uuidv4()
        };
    
    //Obtain existing Notes
    readFile('db/db.json', 'utf8', (err, data)=>{
        if (err) {
            console.error(err);
        } else {
        //Convert JSON
        const parsedNotes = JSON.parse(data);

        //Add a new Note 
        parsedNotes.push(newNote);

        //Write updated Notes back to File with 4 spaces
        writeFile(
            'db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr)=> writeErr ? console.error(writeErr) : console.info('Updated Notes')
            );
        }
    })
    };
})

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})