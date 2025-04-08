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

   async processSensorData(sensorData: any) {
      // Process the incoming sensor data
      // Example: store in database, trigger alerts, etc.

      return {
         message: 'Data received successfully',
         timestamp: new Date().toISOString(),
         data: sensorData
      }
   }

   async findAll(): Promise<Data[]> {
      return this.dataModel.find().exec();
   }
}

