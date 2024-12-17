//* Estas son las rutas de las funciones, toda función debe llevar una ruta para ser accedida

import Router from "express";
import { checkMatching, createAdminUser, createUser, getDevolutionProcesses, getHistory, getUser, loginUser, newPassword, passwordForgot, updateProfilePicture, updateUserC } from "../controllers/usercontroller";
import { addVehicle, deleteVehicle, editVehicleInfo, finishDevolutionProcess, getVehicles, handleDevolution, rentVehicle, searchVehicle } from "../controllers/vehiclecontroller";

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
routes.post('/usuario/recuperarusuario', getUser)
routes.post('/usuario/actualizarfoto', updateProfilePicture)
routes.post('/usuario/actualizar', updateUserC)
routes.post('/usuario/historial', getHistory)

routes.post('/usuario/devolver', handleDevolution)


//* Rutas Protegidas
routes.post('/usuario/crearadmin', createAdminUser)
routes.post('/usuario/devoluciones', getDevolutionProcesses)
routes.post('/vehiculos/aceptardevolucion', finishDevolutionProcess)
routes.post('/vehiculos/editarvehiculo', editVehicleInfo)
routes.post('/vehiculos/eliminarvehiculo', deleteVehicle)




export default routes;