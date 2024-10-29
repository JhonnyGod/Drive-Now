import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, BaseEntity, SaveOptions } from 'typeorm';
import { Organization } from './Organizations';

@Entity('Usuarios')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: string;

    @Column()
    username?: string;

    @Column()
    password?: string;

    @Column()
    email?: string;

    @Column({nullable: true})
    recoveryCode?: string;

    @OneToOne(() => Organization, organization => organization.user)
    organization?: Organization;

}



