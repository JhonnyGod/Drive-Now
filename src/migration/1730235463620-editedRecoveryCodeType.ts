import { MigrationInterface, QueryRunner } from "typeorm";

export class EditedRecoveryCodeType1730235463620 implements MigrationInterface {
    name = 'EditedRecoveryCodeType1730235463620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" ALTER COLUMN "recoveryCode" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Usuarios" ALTER COLUMN "recoveryCode" DROP NOT NULL`);
    }

}
