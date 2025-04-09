// data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Import Types from mongoose
import { Data, DataDocument } from './data.schema';
import { EnergyDataDto } from './dto/energy-data.dto';

// Define the response type (same as in the controller)
export interface ProcessedDataResponse {
   message: string;
   id: string;
   timestamp: string;
   readings: Record<string, number>;
   alerts?: string[];
}

@Injectable()
export class DataService {
   constructor(@InjectModel(Data.name) private dataModel: Model<DataDocument>) { }

   async create(createDataDto: EnergyDataDto): Promise<DataDocument> {
      const createdData = new this.dataModel(createDataDto);
      return createdData.save();
   }

   async processSensorData(sensorData: EnergyDataDto): Promise<ProcessedDataResponse> {
      // Store the raw data as received from the Arduino
      const savedData = await this.create(sensorData);

      // Process energy monitor data for analytics, alerts, etc.
      const energyData = {
         timestamp: new Date().toISOString(),
         sensorType: sensorData.sensorType || 'Energy Monitor',
         readings: {} as Record<string, number>
      };

      // Add available readings to the response
      if (sensorData.voltage !== undefined) {
         energyData.readings['voltage'] = sensorData.voltage;
      }

      if (sensorData.current !== undefined) {
         energyData.readings['current'] = sensorData.current;
      }

      if (sensorData.power !== undefined) {
         energyData.readings['power'] = sensorData.power;
      }

      if (sensorData.energy !== undefined) {
         energyData.readings['energy'] = sensorData.energy;
      }

      // For backward compatibility
      if (sensorData.value !== undefined && Object.keys(energyData.readings).length === 0) {
         energyData.readings['value'] = sensorData.value;
      }

      // Generate alerts if values are outside normal ranges
      const alerts: string[] = [];

      if (sensorData.voltage !== undefined) {
         const voltage = parseFloat(sensorData.voltage.toString());
         if (voltage < 110 || voltage > 130) {
            alerts.push(`Voltage reading ${voltage}V is outside normal range (110-130V)`);
         }
      }

      if (sensorData.current !== undefined) {
         const current = parseFloat(sensorData.current.toString());
         if (current <= 0) {
            alerts.push(`No current detected - device may be disconnected`);
         } else if (current > 15) {
            alerts.push(`Current reading ${current}A is above normal range`);
         }
      }

      // Cast _id to string properly
      const documentId = savedData._id instanceof Types.ObjectId
         ? savedData._id.toString()
         : String(savedData._id);

      return {
         message: 'Data received successfully',
         id: documentId,
         timestamp: energyData.timestamp,
         readings: energyData.readings,
         alerts: alerts.length > 0 ? alerts : undefined
      };
   }

   async findAll(limit = 100): Promise<Data[]> {
      return this.dataModel.find().sort({ timestamp: -1 }).limit(limit).exec();
   }

   async findLatest(): Promise<Data | null> {
      return this.dataModel.findOne().sort({ timestamp: -1 }).exec();
   }
}