//* Ejecución y configuración de express;

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "../database/connection";
import routes from "../routes/routes";
const cors = require('cors');
import cookieParser from "cookie-parser";

const corsOptions = {
    origin: 'http://localhost:3001', //*Esto es para que el CORS permita solo solicitudes de este origen, que es el frontend
    credentials: true,  //*Habilité el uso de Cookies dentro de las solicitudes
}

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const connect = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Conexión exitosa 😘😘😘");
    } catch (error) {
        console.log("Error en la conexión 😭😭😭", error);
    }
}

connect().then(() => {
    app.use('/', routes); 
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}).catch(error => {
    console.error('Database connection error:', error);
});
