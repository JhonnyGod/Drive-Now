//TODO: Primeros controladores del aplicativo.

import { Request, Response } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../database/connection';



export const loginUser = async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {  
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {

        const user = await userRepository.findOne({
            where: { email },
            relations: ['person', 'person.roles'],
        });

        if (!user) {
            return res.status(401).json({ ok: false, msg: 'User not found' });
        }

        if (password === undefined || password === null || user.password === undefined || user.password === null) {
            return res.status(400).json({ ok: false, message: 'Password is missing.' });
        }
        const MATCH = await bcrypt.compare(password, user.password);
        const roles = user.person?.roles;
        if (!MATCH) {
            return res.status(401).json({ ok: false, msg: 'Invalid credentials.' });
        }
    
            return res.json({
                ok: true,
                id_person: user.person?.id_person,
                user: user.username,
                email: user.email,
                firstname: user.person?.firstname,
                lastname: user.person?.lastname,
            });
    
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ ok: false, msg: 'Error logging in user' });
    }
};