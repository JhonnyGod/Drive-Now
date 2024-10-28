//* Controlador del Usuario. Se manejan solo las solicitudes de los usuarios.
//* El funcionamimento es el siguiente: Se recibe una solicitud, se procesa y se envía al servicio y se envía una respuesta 
//* de regreso al controlador.

import { Request, Response } from "express";
import { User } from "../entities/User";
import { AppDataSource } from "../database/connection";
import { UserService } from "../services/userservice";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { types } from "util";
import { UserInfo, userLogin } from "../types/types";
import { ok } from "assert";
import { Person } from "../entities/Persons";
import { userInfo } from "os";

const userService = new UserService();

export const createUser = async (req: Request<{}, {}, UserInfo>, res: Response) => {
    const { username, password, email, firstname, lastname, telefono, documento } = req.body;

    try {
        if(!username || !password || !email || !firstname || !lastname || !telefono || !documento) {
            return res.status(400).json({ok: false, message: 'User info has missing fields'});
        }
    
        const checkUsername = await User.findOneBy({ username });
        if (checkUsername) {
            return res.status(400).json({ok: false, message: 'Username already in use'});
        }

        const checkEmail = await User.findOneBy({ email });
        if (checkEmail) {
            return res.status(400).json({ok: false, message: 'Email already in use'});
        }

        const checkPhoneNumber = await Person.findOneBy({ telefono });
        if (checkPhoneNumber) {
            return res.status(400).json({ok: false, message: 'Phone already in use'});
        }
    
        const checkDocument = await Person.findOneBy({ documento });
        if (checkDocument) {
            return res.status(400).json({ok: false, message: 'id already'});
        }



        const petUser = await userService.crearusuario( username, password, email, firstname, lastname, telefono, documento );

        if (!petUser){
            return res.status(400).json({ok: false, message: 'boom'});
        
        }
        
    } catch (error) {

        return res.status(422).json({ok: false, message: 'ERROR al procesar los datos'})
    }

}


export const loginUser = async(req: Request<{}, {}, userLogin>, res:Response) => {
    const{ username, password } = req.body;

    try {

        if(!username || !password ) {
            return res.status(400).json({ok: false, message: 'User info has missing fields'});
        }


        const initUser = await UserService.initUser(username, password);
        if(!initUser){
            return res.status(422).json({ok: false, message: 'ocurrio un error al iniciar sesion'})
        }






        
    } catch (error) {
        return res.status(422).json({ok: false, message: 'ERROR al iniciar sesion'})
    }
}



