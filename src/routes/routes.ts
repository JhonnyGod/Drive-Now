import Router from "express";
import { createUser } from "../controllers/usercontroller";

const routes = Router();


routes.post('/usuarios', createUser); //* Crear usuario









export default routes;