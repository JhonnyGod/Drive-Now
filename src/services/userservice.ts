import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../database/connection';
import { Person } from '../entities/Persons';
import { UserInfo, userLogin } from '../types/types';
import bcrypt from 'bcrypt';
import { hash } from 'crypto';

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
        const user = await this.usersRepository.findOneBy({ username });
        if (!user) {
            return false;
        }

        if (!user.password) {
            return false;
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return false;
        }

        return user;
    }

}