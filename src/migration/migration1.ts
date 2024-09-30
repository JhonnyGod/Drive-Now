import { MigrationInterface, QueryRunner } from "typeorm";

//* Sistema de migraciones y backup de la database. No se toca.

export class DatabaseGeneration implements MigrationInterface {
    name = 'migration1'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Organizaciones" ("id" SERIAL NOT NULL, "nit" character varying NOT NULL, "nombre" character varying NOT NULL, "contacto" character varying NOT NULL, "correo" character varying NOT NULL, "idusuario" integer NOT NULL, CONSTRAINT "REL_816183a26524dac83909454a55" UNIQUE ("idusuario"), CONSTRAINT "PK_55c37129f8f288610dd632baad7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Usuarios" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_6b4c9e5c7d35b294307b3fd0fea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Vehiculos" ("idvehiculo" SERIAL NOT NULL, "nombre" character varying NOT NULL, "matricula" character varying NOT NULL, "tipovehiculo" character varying NOT NULL, "modelo" character varying NOT NULL, "color" character varying NOT NULL, "cilindraje" integer NOT NULL, "marca" character varying NOT NULL, "capacidad" character varying NOT NULL, "tipoCombustible" character varying NOT NULL, CONSTRAINT "PK_c02fcb9c4738cbc7958d2d55caf" PRIMARY KEY ("idvehiculo"))`);
        await queryRunner.query(`CREATE TABLE "Facturas" ("idfactura" SERIAL NOT NULL, "fecha" TIMESTAMP NOT NULL, "idalquiler" integer, CONSTRAINT "REL_5c7adf193b4aa88f458fe7a468" UNIQUE ("idalquiler"), CONSTRAINT "PK_67b66f489b37f892a3d09302543" PRIMARY KEY ("idfactura"))`);
        await queryRunner.query(`CREATE TABLE "Alquileres" ("idalquiler" SERIAL NOT NULL, "fecha_inicio" date NOT NULL, "fecha_fin" date NOT NULL, "fecha_devolucion" date, "estado" boolean NOT NULL DEFAULT false, "idcliente" character varying, "idvehiculo" integer, CONSTRAINT "PK_e3095deef37d69d66d329806a60" PRIMARY KEY ("idalquiler"))`);
        await queryRunner.query(`CREATE TABLE "Personas" ("id" SERIAL NOT NULL, "id_usuario" integer NOT NULL, "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "documento" character varying NOT NULL, "telefono" character varying NOT NULL, "correo" character varying NOT NULL, CONSTRAINT "UQ_01e8e5997be9ec005da02471429" UNIQUE ("id_usuario"), CONSTRAINT "UQ_2889ed0ee1a40db3c4b6d959144" UNIQUE ("documento"), CONSTRAINT "REL_01e8e5997be9ec005da0247142" UNIQUE ("id_usuario"), CONSTRAINT "PK_8f09fb6a5f973da822e4538031c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Organizaciones" ADD CONSTRAINT "FK_816183a26524dac83909454a55f" FOREIGN KEY ("idusuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Facturas" ADD CONSTRAINT "FK_5c7adf193b4aa88f458fe7a4687" FOREIGN KEY ("idalquiler") REFERENCES "Alquileres"("idalquiler") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Alquileres" ADD CONSTRAINT "FK_f73ac7b0eedaeaf6c6a12d89878" FOREIGN KEY ("idcliente") REFERENCES "Personas"("documento") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Alquileres" ADD CONSTRAINT "FK_1c28d1f66da6646b9452f3ed993" FOREIGN KEY ("idvehiculo") REFERENCES "Vehiculos"("idvehiculo") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Personas" ADD CONSTRAINT "FK_01e8e5997be9ec005da02471429" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Personas" DROP CONSTRAINT "FK_01e8e5997be9ec005da02471429"`);
        await queryRunner.query(`ALTER TABLE "Alquileres" DROP CONSTRAINT "FK_1c28d1f66da6646b9452f3ed993"`);
        await queryRunner.query(`ALTER TABLE "Alquileres" DROP CONSTRAINT "FK_f73ac7b0eedaeaf6c6a12d89878"`);
        await queryRunner.query(`ALTER TABLE "Facturas" DROP CONSTRAINT "FK_5c7adf193b4aa88f458fe7a4687"`);
        await queryRunner.query(`ALTER TABLE "Organizaciones" DROP CONSTRAINT "FK_816183a26524dac83909454a55f"`);
        await queryRunner.query(`DROP TABLE "Personas"`);
        await queryRunner.query(`DROP TABLE "Alquileres"`);
        await queryRunner.query(`DROP TABLE "Facturas"`);
        await queryRunner.query(`DROP TABLE "Vehiculos"`);
        await queryRunner.query(`DROP TABLE "Usuarios"`);
        await queryRunner.query(`DROP TABLE "Organizaciones"`);
    }
}
