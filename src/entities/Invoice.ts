import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Rental } from './Rental';

@Entity('Facturas')
export class Invoice {

    @PrimaryGeneratedColumn()
    idfactura?: number;  

    @OneToOne(() => Rental, rental => rental.invoice)  
    @JoinColumn({ name: 'idalquiler' })  
    alquiler?: Rental;  

    @Column()
    fecha?: Date; 
}
