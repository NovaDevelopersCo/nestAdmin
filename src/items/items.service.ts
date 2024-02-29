import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Items } from './items.model';
import { FilesService } from 'src/files/files.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';

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
      // Handle case where the item is not found
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
  async updateItem(id: number, updateDto: CreateItemDto, image: any) {
    const item = await this.itemsRepository.findByPk(id);

    if (!item) {
      // Handle case where the item is not found
      return null;
    }

    // Update item properties
    item.title = updateDto.title;
    item.description = updateDto.description;

    if (image !== undefined) {
      const fileName = await this.fileService.createFile(image);
      item.image = fileName;
    }

    await item.save();

    return item;
  }
}
