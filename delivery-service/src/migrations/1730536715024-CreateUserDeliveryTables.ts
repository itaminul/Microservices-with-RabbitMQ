import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserDeliveryTables1730536715024 implements MigrationInterface {
    name = 'CreateUserDeliveryTables1730536715024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" integer, "role_name" character varying NOT NULL DEFAULT true, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Delivery" ("id" SERIAL NOT NULL, "usersId" integer NOT NULL, "orderId" integer NOT NULL, "product" character varying NOT NULL, "quantity" integer NOT NULL, "deliveryStatus" boolean NOT NULL DEFAULT 'false', CONSTRAINT "PK_90b858c3595a15f0e9bc9b972be" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Delivery"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
