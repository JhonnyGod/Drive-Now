import { MigrationInterface, QueryRunner } from "typeorm";

export class Newmig1730155239643 implements MigrationInterface {
    name = 'Newmig1730155239643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP COLUMN "breakfast"`);
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP COLUMN "email"`);
    }

}
