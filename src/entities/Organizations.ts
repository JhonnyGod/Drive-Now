import {Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, PrimaryColumn} from 'typeorm';
import { User } from './User';


@Entity('Organizaciones')
export class Organization{

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    nit?: string;

    @Column()
    nombre?: string;

    @Column()
    contacto?: string;

    @Column()
    correo?: string;

    @Column() 
    idusuario?: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'idusuario' })  
    user?: User;

    
}