import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1731303727122 implements MigrationInterface {
    name = 'CreateTable1731303727122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Delivery" ("id" SERIAL NOT NULL, "usersId" integer NOT NULL, "orderId" integer NOT NULL, "product" character varying NOT NULL, "quantity" integer NOT NULL, "status" character varying NOT NULL, "customerDeliveryStatus" character varying NOT NULL DEFAULT PENDING, CONSTRAINT "PK_90b858c3595a15f0e9bc9b972be" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Delivery"`);
    }

}
