import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneAndDescriptionToCustomer1785753579918 implements MigrationInterface {
    name = 'AddPhoneAndDescriptionToCustomer1785753579918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "phone"`);
    }

}
