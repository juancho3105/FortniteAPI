import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DB_HOST, DB_PORT, DB_DATABASE } from './config.js'
import routerPersonajes from "./routes/Personajes.routes.js";

const connection = 'mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_DATABASE;
mongoose.connect(connection).then();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(routerPersonajes);

app.use((req, res) => {
    res.status(404).json({ status: false, messsage: '404 Not Found' });
})

// app.get('/', (req, res) => {
// res.send("hablalo ");
// });

export default app;

