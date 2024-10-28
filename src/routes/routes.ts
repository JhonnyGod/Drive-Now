import Router from "express";
import { createUser } from "../controllers/usercontroller";

const routes = Router();


routes.post('/usuario/registrarse', createUser); //* Crear usuario









export default routes;