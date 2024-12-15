import { Entity, Column, OneToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
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

    @Column({type: 'varchar', nullable: true})
    recoveryCode?: string | null | undefined;

    @Column({type: 'varchar', nullable: true})
    profileImage?: string | null | undefined;

    @Column({type: 'boolean', default: false})
    isAdmin?: boolean;

    @OneToOne(() => Organization, organization => organization.user)
    organization?: Organization;

}



