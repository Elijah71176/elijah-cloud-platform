import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customers/customer.module';
import { ProjectsModule } from './projects/projects.module';
import { RequestModule } from './request/request.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';

const isAwsRds =
  process.env.DATABASE_URL?.includes('rds.amazonaws.com') ?? false;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,

      ssl: isAwsRds
        ? {
          rejectUnauthorized: false,
        }
        : false,

      autoLoadEntities: true,
      synchronize: true,
    }),

    CustomerModule,
    ProjectsModule,
    RequestModule,
    DashboardModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
