import express from 'express'
import { initializeDatabase, dbAll, dbGet, dbRun } from './util/database.js';

const app = express();
app.use(express.json());

app.get('/timetable', async (req, res)=>{
    const users = await dbAll("SELECT * FROM timetable");
    res.status(200).json(users);
});

app.get('/timetable/:id', async (req,res) => {
    const id = req.params.id;
    const user = await dbGet("SELECT * FROM timetable WHERE id = ?;", [id]);
    if(!user){
        return res.status(404).json({message: "Not found"});
    }
    res.status(200).json(user);
    
})

app.post('/timetable', async (req, res) =>{
    const {day, time, subject} = req.body;
    if(!day || !time || !subject ){
        return res.status(400).json({message: "Missing data"});
    }
    const result = await dbRun("INSERT INTO timetable (day, time, subject) VALUES (?, ?, ?);",[day, time, subject]);
    res.status(201).json({id: result.lastID, day, time, subject});
});

app.put("/timetable/:id", async (req, res) =>{
    const id = req.params.id;
    const data = dbGet("SELECT * FROM timetable WHERE id = ?;", [id]);
    if(!data){
        return res.status(404).json({message: "Not found"});
    }
    const {day, time, subject} = req.body;
    if(!day || time == null || !subject){
        return res.status(400).json({message: "Missing data"});
    }
    await dbRun("UPDATE timetable SET day = ?, time = ?, subject = ? WHERE id = ?;",[day, time, subject, id]);
    res.status(200).json({id, day, time, subject});
});

app.delete("/timetable/:id", async (req, res)=>{
    const id = req.params.id;
    const data = dbGet("SELECT * FROM timetable WHERE id = ?;", [id]);
    if(!data){
        return res.status(404).json({message: "Not found"});
    }
    await dbRun("DELETE FROM timetable WHERE id = ?;", [id]);
    res.status(200).json({message: "Successfuly deleted! "});
});

app.use((req, res, next, err) =>{
    if(err){
        res.status(500).json({message: `Error ${err.message}`});
    }
});

async function startServer() {
    await initializeDatabase();
    app.listen(3000, () =>{
        console.log('server runs on 3000') ;
    });
}

startServer();