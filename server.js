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

//Route for Notes Page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//POST New Note
app.post('/api/notes', (req, res) => {

    //Destructure req.body
    const { title, text } = req.body;
    
    //Create new Note with UUID
    const newNote = {
        title,
        text,
        id: uuidv4()
    }

    //Read DB
    readFile('db/db.json', 'utf8', (err, data) => {

        //Error Handling
        if(err) {
            console.error('Failed to read from the database file', err)
            return res.status(500).json({'error': 'Failed to read from the database file'})
        }

        // Convert JSON
        const parsedNotes = JSON.parse(data);
        
        // Add a new Note 
        parsedNotes.push(newNote);
        
        // Write updated Notes back to DB
        writeFile('db/db.json', JSON.stringify(parsedNotes), (err) => {

            //Error Handling
            if(err) {
                console.error('Failed to write to the database file', err)
                return res.status(500).json({'error': 'Failed to write to the database file'})
            }
            
            //Send the Updated Notes List
            res.status(201).json(parsedNotes);
        });
    });
});

//GET Notes
app.get('/api/notes', (req, res) => {

    //Read DB
    readFile('db/db.json', 'utf8', (err, data) => {

        //Error Handling
        if(err) {
            console.error('Failed to read from the database file', err)
            return res.status(500).json({'error': 'Failed to read from the database file'})
        }

        //Send the Data
        res.status(200).send(data);
    });
});


//DELETE Notes
app.delete('/api/notes/:id', (req,res) => {

    //Note Selected for Deletion
    const noteID = req.params.id;

    //Read DB
    readFile('db/db.json', 'utf-8', (err,data) => {

        //Error Handling
        if(err) {
            console.error('Failed to read from the database file', err)
            return res.status(500).json({'error': 'Failed to read from the database file'})
        }

        // Convert JSON
        const parsedNotes = JSON.parse(data);
        
        //Converted JSON filtering out the Deleted Note
        const updatedNotes = parsedNotes.filter(note => note.id !== noteID);

        //Rewrite the File 
        writeFile('db/db.json', JSON.stringify(updatedNotes), (err) => {

            //Error Handling
            if(err) {
                console.error('Failed to write to the database file', err)
                return res.status(500).json({'error': 'Failed to write to the database file'})
            }
            

            //Send updated Notes
            res.status(200).json(updatedNotes);
        })
    })
})

//Listen 
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})