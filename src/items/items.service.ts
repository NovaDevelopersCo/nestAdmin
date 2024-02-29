import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Items } from './items.model';
import { FilesService } from 'src/files/files.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { User } from '../models/user.model';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Items) private itemsRepository: typeof Items,
    private fileService: FilesService,
  ) {}

  async getAllItems() {
    const items = await this.itemsRepository.findAll({
      include: { all: true },
    });
    return items;
  }

  async getItemsWithFilters(filterDto: GetItemsFilterDto) {
    const { search } = filterDto;

    let items = await this.itemsRepository.findAll({
      include: { all: true },
    });
    if (search) {
      items = await items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    const totalPages = Math.ceil(items.length / 100);
    const response = {
      totalPages: totalPages,
      items: items,
    };
    return response;
  }

  async create(dto: CreateItemDto, image: any) {
    if (image !== undefined) {
      const fileName = await this.fileService.createFile(image);
      const item = await this.itemsRepository.create({
        ...dto,
        image: fileName,
      });
      return item;
    }
    const item = await this.itemsRepository.create({ ...dto });
    return item;
  }

  async deleteItem(id: number) {
    const item = await this.itemsRepository.findByPk(id);

    if (!item) {
      return null;
    }

    await item.destroy();

    return item;
  }
  async getItemById(id: number) {
    const item = await this.itemsRepository.findOne({
      where: { id },
    });
    item.viewsCount++;
    item.save();
    return item;
  }
  async updateItem(id: number, dto: CreateItemDto,image: any) {
    try {
      const card = await this.itemsRepository.findByPk(id);

      if (!card) {
        return null;
      }

      const { ...updatedFields } = dto;

      await card.update(updatedFields);

      return card;
    } catch (error) {
      throw new Error('Ошибка при обновлении карточки');
    }
  }
}
