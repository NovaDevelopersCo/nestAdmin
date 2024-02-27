import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({ allowNull: false })
  login: string;

  @Column({ allowNull: false })
  password: string;
}
