const fs = require('fs');
const path = require('path');

module.exports = app => {

    // Setup notes variable
    fs.readFile("db/db.json","utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        app.get("/api/notes",(req, res)=> {

            res.json(notes);
        });

 
        app.post("/api/notes",(req, res)=> {

            let newNote = req.body;
            let uniqueID = (notes.length).toString();
             newNote.id = uniqueID;
            notes.push(newNote);
            updateDb();
            return console.log("Added new note: "+newNote.title);
        });


        app.get("/api/notes/:id",(req,res) =>{

            res.json(notes[req.params.id]);
        });

        // Deletes a note with specific id
        app.delete("/api/notes/:id",(req, res)=> {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id "+req.params.id);
        });

        app.get('/notes',(req,res) =>{
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });
        
        app.get('*', (req,res) =>{
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        function updateDb() {
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }

    });

}