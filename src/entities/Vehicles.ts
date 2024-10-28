import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Rental } from './Rental';

@Entity('Vehiculos')
export class Vehicle extends BaseEntity{

    @PrimaryGeneratedColumn()
    idvehiculo?: number; 

    @Column()
    nombre?: string;

    @Column()
    matricula?: string;

    @Column()
    tipovehiculo?: string;  

    @Column()
    modelo?: string;

    @Column()
    color?: string;

    @Column()
    cilindraje?: number;

    @Column()
    marca?: string;

    @Column()
    capacidad?: string; 

    @Column()
    tipoCombustible?: string;  

    @OneToMany(() => Rental, rental => rental.idvehiculo)
    alquileres?: Rental[]; 
}
