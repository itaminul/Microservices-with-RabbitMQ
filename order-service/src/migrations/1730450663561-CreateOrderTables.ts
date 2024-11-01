import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTables1730450663561 implements MigrationInterface {
    name = 'CreateOrderTables1730450663561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Order" ("id" SERIAL NOT NULL, "usersId" integer NOT NULL, "product" character varying NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_3d5a3861d8f9a6db372b2b317b7" PRIMARY KEY ("id"))`);       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Order"`);
    }

}
