import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../database/connection';
import { Person } from '../entities/Persons';
import { UserInfo, userLogin } from '../types/types';

export class UserService{

    private usersRepository: Repository<User>;
    private personRepository: Repository<Person>;

    constructor(){
        this.usersRepository = AppDataSource.getRepository(User);
        this.personRepository = AppDataSource.getRepository(Person);
    }

    public async crearUsuario(userInfo: UserInfo){
        const {username, email, password, documento, firstname , lastname, telefono } = userInfo;
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        await this.usersRepository.save(newUser);

        const person = new Person();
        person.nombre = firstname;
        person.apellido = lastname;
        person.telefono = telefono;
        person.documento = documento;
        person.user = newUser;
        await this.personRepository.save(person);

        return {usuario: newUser, persona: person}
    }

 
    public async initUser(userData: userLogin){
        console.log("Jairo es un cacorro de segundo grado")
        return userData    
    }

}