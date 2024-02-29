import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Items } from './items.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';

@ApiTags('Items')
@Controller('api/items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @ApiOperation({ summary: 'Получить все товары (с параметрами)' })
  @Get()
  @ApiResponse({ status: 200, type: [Items] })
  getItems(@Query() filterDto: GetItemsFilterDto): Items[] {
    if (Object.keys(filterDto).length) {
      return this.itemsService.getItemsWithFilters(
        filterDto,
      ) as unknown as Items[];
    } else {
      return this.itemsService.getAllItems() as unknown as Items[];
    }
  }

  @ApiOperation({ summary: 'Создать товар' })
  @Post()
  @ApiResponse({ status: 200, type: Items })
  @UseInterceptors(FileInterceptor('image'))
  createItem(@Body() dto: CreateItemDto, @UploadedFile() image) {
    return this.itemsService.create(dto, image);
  }

  @ApiOperation({ summary: 'Получить товар по id' })
  @Get('/:id')
  @ApiResponse({ status: 200, type: Items })
  getByValue(@Param('id') id: number) {
    return this.itemsService.getItemById(id);
  }
  @ApiOperation({ summary: 'Обновить товар по id' })
  @Post('/:id/update')
  @ApiResponse({ status: 200, type: Items })
  @UseInterceptors(FileInterceptor('image'))
  updateItem(
    @Param('id') id: number,
    @Body() updateDto: CreateItemDto,
    @UploadedFile() image,
  ) {
    return this.itemsService.updateItem(id, updateDto, image);
  }
  @ApiOperation({ summary: 'Удалить товар по id' })
  @Post('/:id/delete')
  @ApiResponse({ status: 200, type: Items })
  deleteItem(@Param('id') id: number) {
    return this.itemsService.deleteItem(id);
  }
}
