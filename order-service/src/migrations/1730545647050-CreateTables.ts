import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1730545647050 implements MigrationInterface {
    name = 'CreateTables1730545647050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Order" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Order" DROP COLUMN "status"`);
    }

}
