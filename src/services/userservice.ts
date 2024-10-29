import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../database/connection';
import { Person } from '../entities/Persons';
import { changePassword, forgotPassword, UserInfo, userLogin } from '../types/types';
import bcrypt from 'bcrypt';
import jwt, { Secret } from "jsonwebtoken";
const nodemailer = require("nodemailer");


export class UserService {

    private usersRepository: Repository<User>;
    private personRepository: Repository<Person>;

    constructor() {
        this.usersRepository = AppDataSource.getRepository(User);
        this.personRepository = AppDataSource.getRepository(Person);
    }

    public async crearUsuario(userInfo: UserInfo) {
        const { username, email, password, documento, firstname, lastname, telefono } = userInfo;
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;

        //* Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        newUser.password = hashedPassword;

        await this.usersRepository.save(newUser);

        const person = new Person();
        person.nombre = firstname;
        person.apellido = lastname;
        person.telefono = telefono;
        person.documento = documento;
        person.user = newUser;
        await this.personRepository.save(person);

        return { usuario: newUser, persona: person }
    }


    public async initUser(userData: userLogin) {

        const { username, password } = userData;
        if (!username || !password) {
            return false;
        }

        const User = await this.usersRepository.findOneBy({ username });

        if (!User) {
            return false;
        }

        if (!User.password) {
            return false;
        }

        const checkPassword = await bcrypt.compare(password, User.password);
        if (!checkPassword) {
            return false;
        }

        const checkedUserData = { //* Payload del usuario, se almacena esta información en el token
            username: User.username,
            email: User.email,
            user_id: User.id
        }

        const jwtSecret = process.env.JWT_SECRET as Secret; //* Cambiar el tipo de la SecretWord de JWT

        const Token = jwt.sign(checkedUserData, jwtSecret, { expiresIn: "2h" }); //* Generar el token de autenticación

        //TODO:Estoy pensando en donde guardar el token.

        return { username: User.username, email: User.email, token: Token };
    }


    public async sendRecoveryEmail(userData: forgotPassword) {
        const { email } = userData;
        console.log(email);
        console.log(email);
        console.log(email);
        console.log(email);
        console.log(email);
        console.log(email);
        console.log(email);
        console.log(email);
        try {
            if (!email) {
                return { ok: false, message: 'Email is required' };
            }

            const user = await this.usersRepository.findOneBy({ email });

            if (!user) {
                return { ok: true, message: `If email exists, an email will be sent to ${email}` };
            }

            //* Generar un código de recuperación
            const recoveryCode = Math.floor(1000 + Math.random() * 9000);
            user.recoveryCode = recoveryCode.toString();
            await this.usersRepository.save(user);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            })

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Drive now password reset',
                text: 'El siguiente código es para restablecer su contraseña: ' + user.recoveryCode,
            };

            const send = await transporter.sendMail(mailOptions);
            if (send) {
                return true;
            }
            return false;

        } catch (error) {
            console.log(error);
            return { ok: false, message: 'Error while sending email', error: error };
        }
    }

    public async checkCode(email: string, code: string) {
        const verification = await this.usersRepository.findOneBy({ email, recoveryCode: code });
        if (!verification) {
            return false
        }
        true
    }

    public async newPassword(userData: changePassword) {
       try {
         const { code, password } = userData;
         const user = await this.usersRepository.findOneBy({ recoveryCode: code });
 
         if (!user) {
             return false;
         }
 
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         user.password = hashedPassword;
         user.recoveryCode = null;
         await this.usersRepository.save(user);
         return true;
       } catch (error) {
              console.log(error);
              return false;
       }
    }
}