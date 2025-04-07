import express from 'express'
import { initializeDatabase, dbAll, dbGet, dbRun } from './util/database.js';

const app = express();
app.use(express.json());

app.get('/', async (req, res)=>{
    const users = await dbAll("");
    res.status(200).json(users);
});

app.get('//:id', async (req,res) => {
    const id = req.params.id;
    const user = await dbGet(" WHERE id = ?;", [id]);
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user);
    
})

app.post('/users', async (req, res) =>{
    const {name, age} = req.body;
    if(!name || !age){
        return res.status(400).json({message: "Missing data"});
    }
    const result = await dbRun("INSERT INTO users (name, age) VALUES (?, ?);",[name, age]);
    res.status(201).json({id: result.lastID,name,age});
});

app.put("/users/:id", async (req, res) =>{
    const id = req.params.id;
    const user = dbGet("SELECT * FROM users WHERE id = ?;", [id]);
    if(!user){
        return res.status(404).json({message: "User nem található"});
    }
    const {name, age} = req.body;
    if(!name || !age){
        return res.status(400).json({message: "Missing data"});
    }
    await dbRun("UPDATE users SET name = ?, age = ? WHERE id = ?;",[name, age, id]);
    res.status(200).json({id, name, age});
});

app.delete("/users/:id", async (req, res)=>{
    const id = req.params.id;
    const user = dbGet("SELECT * FROM users WHERE id = ?;", [id]);
    if(!user){
        return res.status(404).json({message: "User nem található"});
    }
    await dbRun("DELETE FROM users WHERE id = ?;", [id]);
    res.status(200).json({message: "Sikeres törlés!%"});
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