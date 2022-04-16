import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {
  createServer
} from "http";
import {
  Server
} from "socket.io";
import connection from './db.js'
import ChatServer from './backend/ChatServer.js'
import MapServer from './backend/MapServer.js'
import AuthServer from './backend/AuthServer.js'
import DatabaseServer from './backend/DatabaseServer.js'

// Required environment variables- MONGO_URI
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// connect to database
connection();

// list databases in console as a test
const defaultConnection = mongoose.connection;
mongoose.connection.on("connected", () => {
  mongoose.connection.client.db().admin().listDatabases()
    .then((result) => {
      result.databases.forEach((db) => console.log(` - ${db.name}`))
    })
});

AuthServer(app);
ChatServer(app);
MapServer(app);
DatabaseServer(app);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))

// listen for requests :)
const listener = app.listen(process.env.PORT || 5000, function() {
  console.log("Node is running at http://localhost:" + listener.address().port)
})

export default app
