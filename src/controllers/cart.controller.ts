import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Param,
  Get,
  Patch,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ItemsService } from '../services/items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}

  @Get()
  async getItems(@Res() res: Response) {
    const items = await this.itemService.getItems();
    return res.json(items);
  }

  @Post()
  async createItem(@Body() body: any, @Res() res: Response) {
    const newItem = await this.itemService.createItem(body);
    return res.status(HttpStatus.CREATED).json(newItem);
  }

  @Patch(':id')
  async updateItem(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const itemId = Number(id);
    if (isNaN(itemId) || itemId <= 0) {
      throw new BadRequestException('Invalid ID');
    }

    const updatedItem = await this.itemService.updateItem(id, body);
    if (!updatedItem) {
      throw new NotFoundException('Item Not Found');
    }

    return res.json(updatedItem);
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: string, @Res() res: Response) {
    const itemId = Number(id);
    if (isNaN(itemId) || itemId <= 0) {
      throw new BadRequestException('Invalid ID');
    }

    const deletedItem = await this.itemService.deleteItem(id);
    if (!deletedItem) {
      throw new NotFoundException('Item Not Found');
    }

    return res
      .status(HttpStatus.NO_CONTENT)
      .json({ message: 'Item deleted successfully' });
  }
}
