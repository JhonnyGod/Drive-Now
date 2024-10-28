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
        return 0
    }


    public async initUser(userData: userLogin){
        console.log("Jairo es un cacorro de segundo grado")
        return userData    
    }

}