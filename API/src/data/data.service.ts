import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Data } from './data.schema';

@Injectable()
export class DataService {
   constructor(@InjectModel(Data.name) private dataModel: Model<Data>) { }

   async create(createDataDto: { SensorType: string; value: number }): Promise<Data> {
      const createdData = new this.dataModel(createDataDto);
      return createdData.save();
   }

   async findAll(): Promise<Data[]> {
      return this.dataModel.find().exec();
   }
}
