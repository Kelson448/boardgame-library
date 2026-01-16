import parse from "csv-simple-parser"
import { Database } from "bun:sqlite"

type BGGCollectionRow = {
    objectname: string
    objectid: string
}

const file = Bun.file("./src/data/collection.csv")
const text = await file.text()
const collection  = parse(text, {
  header: true,
}) as BGGCollectionRow[]

const db = new Database("./src/data/boardgame-library.sqlite", {create: true, strict: true})



// Create table named boardgame if it doesn't exist with column for gameid, name, and a boolean completed
db.run(`
  CREATE TABLE IF NOT EXISTS boardgame (
    gameid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
  )
`)

// populate the games table, inserting if it doesn't exist. use the objectName as name and objectId as gameid
const insert = db.prepare(`
  INSERT OR IGNORE INTO boardgame (gameid, name, completed)
  VALUES (?, ?, ?)
`)

for (const row of collection) {
  insert.run(
    parseInt(row.objectid),
    row.objectname,
    false
  )
}

//gracefully close the database connection
db.close(false)