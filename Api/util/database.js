import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite');
export function dbAll(sql, params = []){
    return new Promise((resolve, reject)=>{
        db.all(sql, params, (err, rows)=>{
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params = []){
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) =>{
            if(err) reject(err);
            else resolve(row);
        });
    });
} 

export function dbRun(sql, params = []){
    return new Promise((resolve, reject) =>{
        db.run(sql, params, function(err){
            if(err) reject(err);
            else resolve(this);
        });
    });
}

export async function initializeDatabase(){
    await dbRun("DROP TABLE IF EXISTS timetable");
    await dbRun("CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, day STRING, time INTEGER, subject STRING)");

    const timetable =[
        {day: 'Hétfő', time: 1, subject: "Magyar"},
        {day: 'Hétfő', time: 2, subject: "Matek"},
        {day: 'Hétfő', time: 3, subject: "Töri"},
        {day: 'Kedd', time: 4, subject: "Töri"},
        {day: 'Kedd', time: 5, subject: "Php"},
        {day: 'Szerda', time: 7, subject: "Php"},
        {day: 'Szerda', time: 8, subject: "Php"},
        {day: 'Csütörök', time: 8, subject: "Php"},
        {day: 'Csütörök', time: 8, subject: "Php"},

    ];

    for(const user of users){
        await dbRun("INSERT INTO users (name, age) VALUES (?, ?);",[user.name, user.age]);
    } 
}