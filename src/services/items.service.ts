import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  createItem(data: any): Promise<User> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  getItems(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  updateItem(id: string, data: any): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteItem(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
