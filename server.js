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
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//PUT Requests for Notes
app.post('/api/notes', (req, res) => {
    //Destructure req.body
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        //Obtain existing Notes
        readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to read notes.' });
            } 

            // Convert JSON
            const parsedNotes = JSON.parse(data);
            
            // Add a new Note 
            parsedNotes.push(newNote);
            
            // Write updated Notes back to File with 4 spaces
            writeFile('db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).json({ error: 'Failed to write new note.' });
                }
                console.info('Updated Notes');
                res.status(201).json({ status: "success", body: newNote });
            });
        });
    } else {
        res.status(400).json({ error: 'Title and text are required.' });
    }
});

app.get('/api/notes', (req, res) => {
    readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
            return;
        }
        const jsonData = JSON.parse(data);
        console.log("Returning data:", jsonData); 
        res.json(jsonData);
    });
});

//Listen 
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})