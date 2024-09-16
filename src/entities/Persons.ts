import {Entity, Column, OneToOne, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { User } from './User';
import { Rental } from './Rental';

@Entity('Personas')
export class Person{

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    id_usuario?: number;

    @Column()
    nombre?: string;

    @Column()
    apellido?: string;

    @Column({unique: true})
    documento?: string;

    @Column()
    telefono?: string;

    @Column()
    correo?: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'id_usuario' }) 
    user?: User;

    @OneToMany(() => Rental, rental => rental.idcliente) 
    alquileres?: Rental[];
}