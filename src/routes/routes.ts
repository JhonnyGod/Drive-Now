//* Estas son las rutas de las funciones, toda función debe llevar una ruta para ser accedida

import Router from "express";
import { checkMatching, createAdminUser, createUser, loginUser, newPassword, passwordForgot } from "../controllers/usercontroller";
import { get } from "http";
import { addVehicle, getVehicles, rentVehicle, searchVehicle } from "../controllers/vehiclecontroller";

const routes = Router();

//* Rutas del Usuario
routes.post('/usuario/registrarse', createUser); //* Crear usuario, esta Ruta indica que a través de /usuario/registrarse se puede acceder a la función createUser
routes.post('/usuario/login', loginUser); //* Iniciar sesión, esta Ruta indica que a través de /usuario/login se puede acceder a la función loginUser
routes.post('/usuario/recuperar', passwordForgot)
routes.post('/usuario/validarCodigo', checkMatching)
routes.put('/usuario/actualizaruser', newPassword)
routes.post('/home/recuperarvehiculos', getVehicles)
routes.post('/home/rent', rentVehicle)
routes.post('/admin/crearvehiculo', addVehicle )
routes.post('/usuario/buscar', searchVehicle)

routes.post('/renta/alquilarvehiculo', rentVehicle)

//* Rutas Protegidas
routes.post('/usuario/crearadmin', createAdminUser)




export default routes;