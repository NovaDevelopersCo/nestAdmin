import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Items } from './items.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, FilesService],
  imports: [SequelizeModule.forFeature([Items])],
})
export class ItemsModule {}
