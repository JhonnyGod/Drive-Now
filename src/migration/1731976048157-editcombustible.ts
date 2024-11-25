import { MigrationInterface, QueryRunner } from "typeorm";

export class Editcombustible1731976048157 implements MigrationInterface {
    name = 'Editcombustible1731976048157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Vehiculos" DROP COLUMN "combustible"`);
        await queryRunner.query(`ALTER TABLE "Vehiculos" DROP COLUMN "image_src"`);
        await queryRunner.query(`ALTER TABLE "Vehiculos" ADD "tipoCombustible" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Vehiculos" DROP COLUMN "tipoCombustible"`);
        await queryRunner.query(`ALTER TABLE "Vehiculos" ADD "image_src" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Vehiculos" ADD "combustible" character varying NOT NULL`);
    }

}
