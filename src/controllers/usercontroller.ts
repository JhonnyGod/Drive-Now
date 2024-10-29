//* Controlador del Usuario. Se manejan solo las solicitudes de los usuarios.
//* El funcionamimento es el siguiente: Se recibe una solicitud, se procesa y se envía al servicio y se envía una respuesta 
//* de regreso al controlador.

import { Request, Response } from "express";
import { User } from "../entities/User";
import { UserService } from "../services/userservice";
import { changePassword, forgotPassword, UserInfo, userLogin } from "../types/types";
import { Person } from "../entities/Persons";


const userService = new UserService();

export const createUser = async (req: Request<{}, {}, UserInfo>, res: Response) => {
    const { username, password, email, firstname, lastname, telefono, documento } = req.body;
    try {
        if (!username || !password || !email || !firstname || !lastname || !telefono || !documento) {
            return res.status(400).json({ ok: false, message: 'User info has missing fields' });
        }
        const checkUsername = await User.findOneBy({ username });
        if (checkUsername) {
            return res.status(400).json({ ok: false, message: 'Username already in use' });
        }

        const checkEmail = await User.findOneBy({ email });
        if (checkEmail) {
            return res.status(400).json({ ok: false, message: 'Email already in use' });
        }

        const checkPhoneNumber = await Person.findOneBy({ telefono });
        if (checkPhoneNumber) {
            return res.status(400).json({ ok: false, message: 'Phone already in use' });
        }

        const checkDocument = await Person.findOneBy({ documento });
        if (checkDocument) {
            return res.status(400).json({ ok: false, message: 'id already' });
        }

        const userCreatePetition = await userService.crearUsuario(req.body);

        if (!userCreatePetition) {
            return res.status(400).json({ ok: false, message: 'boom' });
        }

        return res.status(200).json({ ok: true, message: 'User created successfully', user: userCreatePetition });

    } catch (error) {

        return res.status(422).json({ ok: false, message: 'Error while processing data' })
    }
}

export const loginUser = async (req: Request<{}, {}, userLogin>, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ ok: false, message: 'User info has missing fields' });
        }
        const initUser = await userService.initUser(req.body);

        if (!initUser) {
            return res.status(422).json({ ok: false, message: 'User not found, please create an account' })
        }
        
        return res.status(200).json({ ok: true, message: 'User logged in successfully', user: initUser });

    } catch (error) {
        return res.status(422).json({ ok: false, message: 'There was an error when login user' })
    }
}


export const passwordForgot = async (req: Request<{}, {}, forgotPassword>, res: Response) => {
    const { email } = req.body;
    try {
        if (!email){
            return res.status(400).json({ok: false, message: 'empty field, enter your email'})
        }

<<<<<<< HEAD
        const  sendEmail = await userService.sendRecoveryEmail(req.body);
=======
        const sendEmail = await userService.sendEmail(req.body);
>>>>>>> f64cdbcaa7bde93174a77be1474223311dbe2db1

        if( sendEmail ){
            return sendEmail;

        }else {
            return res.status(500).json({ ok: false, message: 'Failed to send email' });
        }

    } catch (error) {
        return res.status(422).json({ok: false, message: 'email not found'});
    }
}


export const newPassword = async (req: Request<{}, {}, changePassword>, res: Response) => {
    const { code, password } = req.body

    try {
        if(!password || !code){

            return res.status(400).json({ok: false, message: 'User info has missing fields'});
        }

        const newPassword = await userService.newPassword(req.body);

        if(newPassword){
            return res.status(200).json({ok: true, message: 'new password sent'});

        }else{
            return res.status(200).json({ok: false, message: 'new password failed'});
        }
    } catch (error) {
        
    }
}


