//* Controlador del Usuario. Se manejan solo las solicitudes de los usuarios.
//* El funcionamimento es el siguiente: Se recibe una solicitud, se procesa y se envía al servicio y se envía una respuesta 
//* de regreso al controlador.
import { Request, Response } from "express";
import { User } from "../entities/User";
import { UserService } from "../services/userservice";
import { AdminInfo, changePassword, forgotPassword, getHistoryData, updateUserInfo, UserInfo, userLogin, validateCode } from "../types/types";
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
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: 'User info has missing fields' });
        }
        const initUser = await userService.initUser(req.body);

        if (!initUser) {
            return res.status(422).json({ ok: false, message: 'User not found, please create an account' })
        }
        const userToken = initUser.token;
        res.cookie('Token', userToken, { //*Aqui lo que hago es guardar el token JWT del usuario en una cookie en el navegador
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 2,
            sameSite: 'strict',
            path: '/'
        })

        return res.status(200).json({
            ok: true,
            message: 'User logged in successfully',
            user: {
                username: initUser.username,
                email: initUser.email,
                id_user: initUser.id_user,
                isAdmin: initUser.isAdmin
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(422).json({ ok: false, message: 'There was an error when login user' })
    }
}
export const passwordForgot = async (req: Request<{}, {}, forgotPassword>, res: Response) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ ok: false, message: 'empty field, enter your email' })
        }

        const sendEmail = await userService.sendRecoveryEmail(req.body);

        if (sendEmail) {
            return res.status(200).json(sendEmail);

        } else {
            return res.status(500).json({ ok: false, message: 'Failed to send email' });
        }

    } catch (error) {
        return res.status(422).json({ ok: false, message: 'email not found' });
    }
}

export const checkMatching = async (req: Request<{}, {}, validateCode>, res: Response) => {
    const { code, email } = req.body;
    try {
        if (!code || !email) {
            return res.status(400).json({ ok: false, message: 'missing fields' });
        }
        const check = await userService.checkCode(req.body);
        if (check) {
            return res.status(200).json({ ok: true, message: 'code matches' });
        }
        return res.status(400).json({ ok: false, message: 'code does not match' });

    } catch (error) {
        return res.status(422).json({ ok: false, message: 'error while processing data' });
    }
}

export const newPassword = async (req: Request<{}, {}, changePassword>, res: Response) => {
    const { code, password, email } = req.body
    try {
        if (!password || !code || !email) {
            return res.status(400).json({ ok: false, message: 'User info has missing fields' });
        }

        const newPassword = await userService.newPassword(req.body);

        if (newPassword) {
            return res.status(200).json({ ok: true, message: 'new password applied, now log in' });

        } else {
            return res.status(400).json({ ok: false, message: 'new password failed' });
        }

    } catch (error) {
        return res.status(422).json({ ok: false, message: 'error while processing data' });
    }
}

export const createAdminUser = async (req: Request<{}, {}, AdminInfo>, res: Response) => {
    const { documento } = req.body;
    if (!documento) {
        return res.status(400).json({ ok: false, message: 'User info has missing fields' });
    }
    try {
        const newAdmin = await userService.createAdmin(req.body);
        if (!newAdmin) {
            return res.status(400).json({ ok: false, message: 'There was an error while creating the admin user' });
        }
        return res.status(200).json({ ok: true, message: 'Admin user created successfully', user: newAdmin.usuario });
    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' });
    }
}

export const getUser = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    try {
        if (!userId) {
            return res.status(400).json({ ok: false, message: 'User info has missing fields' });
        }

        const searchUser = await userService.getUserData(userId);
        if (!searchUser) {
            return res.status(400).json({ ok: false, message: 'User not found' });
        }
        return res.status(200).json({ ok: true, user: searchUser });
    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' });
    }

}

export const updateProfilePicture = async (req: Request, res: Response) => {
    const { userId, profilePic } = req.body;

    if (!userId || !profilePic) {
        return res.status(400).json({ ok: false, message: 'User info has missing fields' });
    }

    try {
        const updatePic = await userService.updateProfilePicture(userId, profilePic);

        if (!updatePic) {
            return res.status(400).json({ ok: false, message: 'Error while updating profile picture' });
        }
        return res.status(200).json({ ok: true, message: 'Profile picture updated successfully', user: updatePic });

    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' });
    }
}

export const updateUserC = async (req: Request<{}, {}, updateUserInfo>, res: Response) => {
    const { username, name, lastname, document, phone, email, userId } = req.body;
    console.log(req.body);

    if (!username || !name || !lastname || !document || !phone || !email || !userId) {
        return res.status(400).json({ ok: false, message: 'User info has missing fields' });
    }

    try {
        const updateUser = await userService.updateUser(req.body);

        if (!updateUser) {
            return res.status(400).json({ ok: false, message: 'Error while updating user' });
        }
        return res.status(200).json({ ok: true, message: 'User updated' });

    } catch (error) {
        console.log(error);
        return res.status(422).json({ ok: false, message: 'Error while processing data' });

    }
}

export const getHistory = async (req: Request<{}, {}, getHistoryData>, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ ok: false, message: 'User info doesn contains userId' });
    }

    try {
        const history = await userService.getHistory(req.body);

        if (!history) {
            return res.status(400).json({ ok: false, message: 'Error while getting history' });
        }
        return res.status(200).json({ ok: true, history });

    } catch (error) {
        console.log(error);
        return res.status(422).json({ ok: false, message: 'Error while processing data' });

    }

}

export const getDevolutionProcesses = async (req: Request, res: Response) => {
    try {
        const processes = await userService.getDevolutionProcesses();
        if (!processes) {
            return res.status(400).json({ ok: false, message: 'Error while getting devolution processes' });
        }
        return res.status(200).json({ ok: true, processes });

    } catch (error) {
        console.log(error);
        return res.status(422).json({ ok: false, message: 'Error while processing data' });

    }
}


