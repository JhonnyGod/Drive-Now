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
import { UserInfo } from "../types/types";
import { ok } from "assert";

const userService = new UserService();

export const createUser = async (req: Request<{}, {}, UserInfo>, res: Response) => {
    const { username, password, email, firstname, lastname, phonenumber, id } = req.body;

    if(!username || !password || !email || !firstname || !lastname || !phonenumber || !id) {
        return res.status(400).json({ok: false, message: 'User info has missing fields'});
    }

    const checkEmail = await User.findOneBy({ email });
    if (checkEmail) {
        return res.status(400).json({ok: false, message: 'Email already in use'});
    }

    const checkUsername = await User.findOneBy({ username });
    if (checkUsername) {
        return res.status(400).json({ok: false, message: 'Username already in use'});
    }

    const checkUserId = await User.findOneBy({ id })
}