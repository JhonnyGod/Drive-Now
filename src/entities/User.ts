import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './Organizations';

@Entity('Usuarios')
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    username?: string;

    @Column()
    password?: string;

    @Column()
    email?: string

    @OneToOne(() => Organization, organization => organization.user)
    organization?: Organization;

}



