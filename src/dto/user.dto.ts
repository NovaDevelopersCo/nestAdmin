import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/user.model';

export class UserDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  id: number;

  constructor(model: User) {
    this.login = model.login;
    this.id = model.id;
  }
}
