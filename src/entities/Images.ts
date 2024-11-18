import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Vehicle } from './Vehicles';

@Entity('Images')
export class Images extends BaseEntity{

    @PrimaryGeneratedColumn()
    id?: number;  

    @Column()
    image_url?: string;

    @OneToOne(() => Vehicle, vehicle => vehicle.image)
    @JoinColumn({name: 'vehicle_id', nullable: false}) 
    vehicle?: Vehicle;

}