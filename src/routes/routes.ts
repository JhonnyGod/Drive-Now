//* Estas son las rutas de las funciones, toda función debe llevar una ruta para ser accedida

import Router from "express";
import { createUser, loginUser } from "../controllers/usercontroller";

const routes = Router();

//* Rutas del Usuario
routes.post('/usuario/registrarse', createUser); //* Crear usuario, esta Ruta indica que a través de /usuario/registrarse se puede acceder a la función createUser
routes.post('/usuario/login', loginUser); //* Iniciar sesión, esta Ruta indica que a través de /usuario/login se puede acceder a la función loginUser








export default routes;