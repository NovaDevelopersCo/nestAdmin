import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Session extends Model<Session> {
  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @Column({ allowNull: false })
  refreshToken: string;

  @BelongsTo(() => User)
  user: User;
}
