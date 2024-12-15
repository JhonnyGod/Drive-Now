import { Code, Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../database/connection';
import { Person } from '../entities/Persons';
import { AdminInfo, changePassword, forgotPassword, UserInfo, userLogin, validateCode } from '../types/types';
import bcrypt from 'bcrypt';
import jwt, { Secret } from "jsonwebtoken";
import { Vehicle } from '../entities/Vehicles';
import { ok } from 'assert';
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
        const { email, password } = userData;
        if (!email || !password) {
            return false;
        }

        const User = await this.usersRepository.findOneBy({ email });

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
            user_id: User.id,
            is_admin: User.isAdmin
        }

        const jwtSecret = process.env.JWT_SECRET as Secret; //* Cambiar el tipo de la SecretWord de JWT

        const Token = jwt.sign(checkedUserData, jwtSecret, { expiresIn: "2h" }); //* Generar el token de autenticación

        return {
            username: User.username,
            email: User.email,
            id_user: User.id,
            token: Token,
            isAdmin: User.isAdmin
        }
    }

    public async sendRecoveryEmail(userData: forgotPassword) {
        const { email } = userData;
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
                text: 'Your password recovery code is:' + user.recoveryCode,
            };

            const send = await transporter.sendMail(mailOptions);
            if (send) {
                console.log("Email Sent")
                return { ok: true, message: "If email exits, an email will be sent to it." };
            }
            return false;

        } catch (error) {
            console.log(error);
            return { ok: false, message: 'Error while sending email', error: error };
        }
    }
    public async newPassword(userData: changePassword) {
        try {
            const { code, password, email } = userData;
            const user = await this.usersRepository.findOneBy({ email: email, recoveryCode: code });

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

    public async checkCode(dataToValidate: validateCode) {
        const user = await this.usersRepository.findOneBy({ email: dataToValidate.email, recoveryCode: dataToValidate.code });
        if (!user) {
            return false;
        }
        return true;
    }
    public async createAdmin(adminDocument: AdminInfo) {
        try {
            const { documento } = adminDocument;
            const person = await this.personRepository.findOneBy({ documento: documento });
            console.log(person);
            if (!person) {
                return false;
            }
            const personUserId = person?.id_usuario
            const personUser = await this.usersRepository.findOneBy({ id: personUserId?.toString() });
            console.log(personUser);

            if (!personUser) {
                return false;
            }
            if (personUser.isAdmin) {
                return {
                    message: 'User is already an admin', usuario: {
                        username: personUser.username,
                        email: personUser.email,
                        id_user: personUser.id
                    }
                };
            }

            personUser.isAdmin = true;
            await this.usersRepository.save(personUser);

            return {
                message: 'User is now an admin', usuario: {
                    username: personUser.username,
                    email: personUser.email,
                    id_user: personUser.id
                }
            };

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async getUserData(userId: number) {

        try {
            const user = await this.usersRepository.findOneBy({ id: userId.toString() });
            if (!user) {
                return false;
            }

            const userPerson = await this.personRepository.findOneBy({ id_usuario: userId });
            if (!userPerson) {
                return false;
            }

            const userJsonData = {
                username: user.username,
                email: user.email,
                name: userPerson.nombre,
                lastname: userPerson.apellido,
                phone: userPerson.telefono,
                document: userPerson.documento,
            }
            
            return userJsonData;
        } catch (error) {
            console.log(error);
            return false;
        }

    }
}
