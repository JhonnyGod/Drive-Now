"use strict";
//* Ejecución y configuración de express;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const connection_1 = require("../database/connection");
const routes_1 = __importDefault(require("../routes/routes"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.AppDataSource.initialize();
        console.log("Conexión exitosa 😘😘😘");
    }
    catch (error) {
        console.log("Error en la conexión 😭😭😭", error);
    }
});
connect().then(() => {
    app.use('/', routes_1.default);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}).catch(error => {
    console.error('Database connection error:', error);
});
