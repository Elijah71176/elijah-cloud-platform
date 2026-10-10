import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteProjectSchema1791630771284 implements MigrationInterface {
    name = 'CompleteProjectSchema1791630771284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_project_customer"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'CUSTOMER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'CUSTOMER', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "service" character varying NOT NULL, "telephone" character varying, "message" text NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "converted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee60bcd826b7e130bfbd97daf66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_updates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2093d4d18851bc0f6ec8b1197e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_milestone" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "targetDate" date, "completedDate" date, "projectId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7a9da5fbeade8826432de525d1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "originalName" character varying NOT NULL, "storageKey" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" integer NOT NULL, "category" character varying NOT NULL DEFAULT 'attachment', "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e0adaaabd364382782d8ef14fcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recipientEmail" character varying NOT NULL, "recipientRole" character varying NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "message" text NOT NULL, "projectId" character varying, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "senderEmail" character varying NOT NULL, "senderRole" character varying NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b1f2a06218031572ae003b431cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "project" ADD "startDate" date`);
        await queryRunner.query(`ALTER TABLE "project" ADD "dueDate" date`);
        await queryRunner.query(`ALTER TABLE "project" ADD "progress" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_b76640329fa79f0b0e9d031c35b" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_updates" ADD CONSTRAINT "FK_9eb8470a1333d4a546db555a012" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_milestone" ADD CONSTRAINT "FK_f7accb0136106f3050f8e96c5e8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_attachments" ADD CONSTRAINT "FK_e55cc4bc84ecd45b89a33d7db26" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_messages" ADD CONSTRAINT "FK_55c643c314713b8df0cd87b67d8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_messages" DROP CONSTRAINT "FK_55c643c314713b8df0cd87b67d8"`);
        await queryRunner.query(`ALTER TABLE "project_attachments" DROP CONSTRAINT "FK_e55cc4bc84ecd45b89a33d7db26"`);
        await queryRunner.query(`ALTER TABLE "project_milestone" DROP CONSTRAINT "FK_f7accb0136106f3050f8e96c5e8"`);
        await queryRunner.query(`ALTER TABLE "project_updates" DROP CONSTRAINT "FK_9eb8470a1333d4a546db555a012"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_b76640329fa79f0b0e9d031c35b"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "progress"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "description"`);
        await queryRunner.query(`DROP TABLE "project_messages"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "project_attachments"`);
        await queryRunner.query(`DROP TABLE "project_milestone"`);
        await queryRunner.query(`DROP TABLE "project_updates"`);
        await queryRunner.query(`DROP TABLE "service_requests"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_project_customer" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
