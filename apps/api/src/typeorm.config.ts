import 'dotenv/config';
import { DataSource } from 'typeorm';

const isAwsRds =
  process.env.DATABASE_URL?.includes('rds.amazonaws.com') ?? false;

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  ssl: isAwsRds
    ? {
        rejectUnauthorized: false,
      }
    : false,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});