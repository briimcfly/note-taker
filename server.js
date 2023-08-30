//Global Variables
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
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Public SendFile
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//PUT Requests for Notes
app.post('/api/notes', (req, res) => {

    //Destructure req.body
    const { title, text } = req.body;
    
    //Create new Note with UUID
    const newNote = {
        title,
        text,
        id: uuidv4()
    }

    //Obtain existing Notes
    readFile('db/db.json', 'utf8', (err, data) => {

        //Error Handling
        if (err) {
            console.error(err);
        } 
        // Convert JSON
        const parsedNotes = JSON.parse(data);
        
        // Add a new Note 
        parsedNotes.push(newNote);
        
        // Write updated Notes back to File with 4 spaces
        writeFile('db/db.json', JSON.stringify(parsedNotes), (err) => {

            //Error Handling
            if (err) {
                console.error(err);
            }
            
            //Send the Updated Notes List
            res.json(parsedNotes);
        });
    });
});

//GET Notes
app.get('/api/notes', (req, res) => {
    readFile('db/db.json', 'utf8', (err, data) => {

        //Error Handling
        if (err) {
            console.error(err);
        }
        
        //Send the Data
        res.send(data);
    });
});

//Listen 
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})