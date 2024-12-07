import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Rental } from './Rental';

@Entity('Facturas')
export class Invoice extends BaseEntity{

    @PrimaryGeneratedColumn()
    idfactura?: number;  

    @OneToOne(() => Rental, (rental) => rental.invoice)
    @JoinColumn({ name: 'idalquiler' })
    alquiler?: Rental;

    @Column()
    fecha?: Date; 

    @Column()
    valor_total?: string;
}
