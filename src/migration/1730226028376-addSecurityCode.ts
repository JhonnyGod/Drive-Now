import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSecurityCode1730226028376 implements MigrationInterface {
    name = 'AddSecurityCode1730226028376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" ADD "recoveryCode" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" DROP COLUMN "recoveryCode"`);
    }

}
