import { ApiProperty } from '@nestjs/swagger';

export class GetItemsFilterDto {
  @ApiProperty({ example: 'Вино', description: 'Поиск', required: false })
  readonly search: string;

  @ApiProperty({
    example: 'asc',
    description: 'desc/asc Сортировка по убыванию/по возрастанию',
    required: false,
  })
  readonly price: string;

  @ApiProperty({
    example: true,
    description: 'Сортировка по популярности',
    required: false,
  })
  readonly popularity: boolean = false;

  @ApiProperty({
    example: true,
    description: 'Сортировка по новизне',
    required: false,
  })
  readonly news: boolean = false;
}
