import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from '../../../schemas/ticket.schema';

@Injectable()
export class TicketService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async create(createTicketDto: Partial<Ticket>): Promise<Ticket> {
    const ticket = new this.ticketModel(createTicketDto);
    return ticket.save();
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().exec();
  }

  async findOne(id: string): Promise<Ticket> {
    return this.ticketModel.findById(id).exec();
  }

  async find(id: string, otp: string): Promise<Ticket> {
    return this.ticketModel.findOne({ id, value: otp }).exec();
  }

  async findOneAndReplace(condition: Object, data: Object): Promise<Ticket> {
    return this.ticketModel
      .findOneAndReplace(
        { ...condition }, // Search condition
        { ...data }, // Data to insert if not found
        { new: true, upsert: true, returnDocument: 'after' }, // Create if not found  // Ensures the returned document includes _id
      )
      .exec();
  }

  async findOneAndUpdate(condition: Object, data: Object): Promise<Ticket> {
    return this.ticketModel
      .findOneAndUpdate(
        { ...condition }, // Search condition
        { ...data }, // Data to insert if not found
        { new: true, upsert: true }, // Create if not found
      )
      .exec();
  }

  async findOneAndDelete(condition: Object): Promise<Ticket> {
    return this.ticketModel.findOneAndDelete({ ...condition }).exec();
  }

  async update(id: string, updateTicketDto: Partial<Ticket>): Promise<Ticket> {
    return this.ticketModel
      .findByIdAndUpdate(id, updateTicketDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Ticket> {
    return this.ticketModel.findByIdAndDelete(id).exec();
  }
}
