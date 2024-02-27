import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from '../schemas/user.schema';

export class UserDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  _id: string;

  constructor(model: UserDocument) {
    this.login = model.login;
    this._id = model._id;
  }
}
