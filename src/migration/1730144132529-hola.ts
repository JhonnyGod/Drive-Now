import { MigrationInterface, QueryRunner } from "typeorm";

export class Hola1730144132529 implements MigrationInterface {
    name = 'Hola1730144132529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD "breakfast" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP COLUMN "breakfast"`);
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP COLUMN "email"`);
    }

}
