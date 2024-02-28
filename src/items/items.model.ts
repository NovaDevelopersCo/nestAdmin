import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ItemsCreationAttrs {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  sale: boolean;
  category: string;
  soldOut: boolean;
  description: string;
  image: string;
  viewsCount: number;
}
@Table({ tableName: 'items' })
export class Items extends Model<ItemsCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный идентефикатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'testItem', description: 'Название товара' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @ApiProperty({
    example: 'Очень вкусный алкоголь',
    description: 'Описание товара',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ApiProperty({ example: 'Картинка', description: 'Захватывающая картинка' })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  image: string;

  @ApiProperty({
    example: 'Очень вкусный алкоголь',
    description: 'Описание товара',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  @ApiProperty({ example: 1202, description: 'Цена' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  price: number;

  @ApiProperty({ example: 1500, description: 'Старая цена' })
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  oldPrice: number;

  @ApiProperty({ example: 155, description: 'Количество просмотров' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  viewsCount: number;

  @ApiProperty({ example: true, description: 'Есть ли скидка' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  sale: boolean;

  @ApiProperty({ example: false, description: 'Распродано ли' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  soldOut: boolean;
}
