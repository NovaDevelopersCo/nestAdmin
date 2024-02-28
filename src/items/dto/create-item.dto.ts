import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    example: 'Шато Марго 1958',
    description: 'Название',
    required: true,
  })
  readonly title: string;

  @ApiProperty({
    example: 'Очень вкусное вино',
    description: 'Описание товара',
  })
  readonly description: string;

  @ApiProperty({
    example: 'Белое полусухое',
    description: 'Категория',
    required: true,
  })
  readonly category: string;

  @ApiProperty({ example: 1560, description: 'Цена', required: true })
  readonly price: number;

  @ApiProperty({
    example: 155,
    description: 'Количество просмотров',
    required: false,
  })
  readonly viewsCount: number;

  @ApiProperty({
    example: 1500,
    description: 'Старая цена',
    required: false,
  })
  readonly oldPrice: number;

  @ApiProperty({
    example: true,
    description: 'Есть ли скидка',
    required: false,
  })
  readonly sale: boolean;

  @ApiProperty({
    example: false,
    description: 'Распродано ли',
    required: false,
  })
  readonly soldOut: boolean;
}
