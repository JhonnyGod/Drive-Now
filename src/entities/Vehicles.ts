import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rental } from './Rental';

@Entity('Vehiculos')
export class Vehicle {

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
