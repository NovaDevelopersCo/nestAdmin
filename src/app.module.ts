import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module'; // Assuming the correct path
import { User } from './models/user.model';
import { Session } from './models/session.model';
import { Items } from './items/items.model';

@Module({
  imports: [
    ConfigModule.forRoot(), // Make sure to configure your environment variables correctly
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      models: [Items, Session, User],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule, // Include the AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
