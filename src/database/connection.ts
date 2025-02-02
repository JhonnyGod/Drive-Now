//* Conexión a la base de datos e inicialización del AppDataSource

import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "../entities/User";
import { Organization } from "../entities/Organizations";
import { Person } from "../entities/Persons";
import { Rental } from "../entities/Rental";
import { Vehicle } from "../entities/Vehicles";
import { Invoice } from "../entities/Invoice";

dotenv.config();

export const AppDataSource = new DataSource({ 
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User,Organization,Person,Rental,Vehicle,Invoice],
    migrations: [__dirname + '/../migration/**/*.ts'],
    subscribers: []
});