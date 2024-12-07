import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, OneToOne } from 'typeorm';
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
    combustible?: string;  

    @Column({nullable: true})
    descripcion?: string;

    @Column({nullable: true})
    valor_dia?: number;

    @Column()
    image_src?: string;

    @Column({default: true})
    disponible?: boolean;


    @OneToMany(() => Rental, rental => rental.idvehiculo)
    alquileres?: Rental[]; 


}
