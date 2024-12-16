import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, BaseEntity } from 'typeorm';
import { Rental } from './Rental';

@Entity('Devoluciones')
export class Return extends BaseEntity {

    @PrimaryGeneratedColumn()
    iddevolucion?: number;

    @Column({ type: 'boolean', default: true })
    goodCondition?: boolean; 

    @Column({ type: 'boolean', default: false })
    earlyReturn?: boolean;  

    @Column({ type: 'varchar', nullable: true })
    earlyReturnReason?: string | null;  

    @Column({ type: 'int', nullable: true })
    rating?: number | null;  

    @OneToOne(() => Rental)
    @JoinColumn({ name: 'idalquiler' })  
    rentalId?: Rental;  
}
