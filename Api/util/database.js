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
        {day: 'Szerda', time: 7, subject: "Js"},
        {day: 'Hétfő', time: 2, subject: "Matek"},
        {day: 'Hétfő', time: 3, subject: "Töri"},
        {day: 'Péntek', time:3, subject: "Php"},
        {day: 'Kedd', time: 5, subject: "Php"},
        {day: 'Csütörtök', time: 4, subject: "C#"},
        {day: 'Szerda', time: 8, subject: "Js"},
        {day: 'Csütörtök', time: 3, subject: "C#"},
        {day: 'Kedd', time: 4, subject: "Töri"},
        {day: 'Péntek', time: 2, subject: "Angol"},
        {day: 'Hétfő', time: 1, subject: "Magyar"},

    ];

    for(const t of timetable){
        await dbRun("INSERT INTO timetable (day, time, subject) VALUES (?, ?, ?);",[t.day, t.time, t.subject]);
    } 
}