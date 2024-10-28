import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteEmailFromPerson1730158650440 implements MigrationInterface {
    name = 'DeleteEmailFromPerson1730158650440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Personas" DROP COLUMN "correo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Personas" ADD "correo" character varying NOT NULL`);
    }

}
