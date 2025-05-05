import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  // auth
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // findAll
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Nếu bạn muốn lấy user kèm theo các bài đăng
  async getUserWithPosts(userId: string): Promise<any> {
    return this.userModel.findById(userId).exec();
  }

  //auth sso & mutation
  async findOrCreateSSOUser(userInfo: any): Promise<User> {
    const { provider, providerId, email, name, avatarSrc } = userInfo;

    let user = await this.userModel.findOne({ provider, providerId });

    if (!user) {
      user = new this.userModel({
        name,
        email,
        provider,
        providerId,
        avatarSrc,
      });
      await user.save();
    }

    return user;
  }

  // dashboard
  async create(data: Partial<User>): Promise<User> {
    const hashPassword = await this.CreatePasswordHash(data.password);

    const newItem = new this.userModel({ ...data, password: hashPassword });
    return newItem.save();
  }

  async update(id: string, data: Partial<any>): Promise<User> {
    const item = await this.userModel.findById(id);
    Object.assign(item, data);
    return item.save();
  }

  async updatePassword(
    id: string,
    newPlainTextPassword: string,
  ): Promise<User> {
    const item = await this.userModel.findById(id);
    Object.assign(item, {
      password: await this.CreatePasswordHash(newPlainTextPassword),
    });
    return item.save();
  }

  // async remove(id: string): Promise<Cat> {
  //   const cat = await this.catModel.findById(id);
  //   return cat.remove();
  // }

  // compare password
  async comparePassword(
    myPlaintextPassword: string,
    passwordInDb: string,
  ): Promise<boolean> {
    // return myPlaintextPassword === passwordInDb;
    return bcrypt.compare(myPlaintextPassword, passwordInDb);
  }

  // create password hash
  async CreatePasswordHash(myPlaintextPassword: string): Promise<string> {
    //return myPlaintextPassword;
    return bcrypt.hash(myPlaintextPassword, saltRounds);
  }
}
