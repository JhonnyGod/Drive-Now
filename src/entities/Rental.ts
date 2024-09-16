import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Person } from './Persons';
import { Vehicle } from './Vehicles';
import { Invoice } from './Invoice';

@Entity('Alquileres')
export class Rental {

    @PrimaryGeneratedColumn()
    idalquiler?: number;  

    @ManyToOne(() => Person, person => person.alquileres) 
    @JoinColumn({ name: 'idcliente', referencedColumnName: 'documento' }) 
    idcliente?: Person;

    @ManyToOne(() => Vehicle, vehicle => vehicle.alquileres) 
    @JoinColumn({ name: 'idvehiculo' })  
    idvehiculo?: Vehicle;

    @Column({ type: 'date' })
    fecha_inicio?: Date; 

    @Column({ type: 'date' })
    fecha_fin?: Date;  

    @Column({ type: 'date', nullable: true })
    fecha_devolucion?: Date | null;  

    @Column({ type: 'boolean', default: false })
    estado?: boolean;  

    @OneToOne(() => Invoice, invoice => invoice.alquiler)  
    invoice?: Invoice; 
}
