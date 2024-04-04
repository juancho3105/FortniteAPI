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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
    res.status(404).json({ status: false, messsage: '404 Not Found' });
})

// app.get('/', (req, res) => {
// res.send("hablalo ");
// });

export default app;

