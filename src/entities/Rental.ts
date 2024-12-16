import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, BaseEntity } from 'typeorm';
import { Person } from './Persons';
import { Vehicle } from './Vehicles';
import { Invoice } from './Invoice';

@Entity('Alquileres')
export class Rental extends BaseEntity{

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

    @Column({ type: 'varchar', default: 'rented' })
    estado?: string;  

    @OneToOne(() => Invoice, (invoice) => invoice.alquiler, { cascade: true, onDelete: 'CASCADE' })
    invoice?: Invoice;
}
