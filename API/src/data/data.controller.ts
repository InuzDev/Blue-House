// data.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DataService } from './data.service';
import { Data } from './data.schema';
import { EnergyDataDto } from './dto/energy-data.dto';

// Define the return type for the processSensorData method
interface ProcessedDataResponse {
   message: string;
   id: string;
   timestamp: string;
   readings: Record<string, number>;
   alerts?: string[];
}

@Controller('data')
export class DataController {
   constructor(private readonly dataService: DataService) { }

   @Post()
   async create(@Body() createDataDto: EnergyDataDto): Promise<ProcessedDataResponse> {
      return this.dataService.processSensorData(createDataDto);
   }

   @Get()
   async findAll(@Query('limit') limit?: string): Promise<Data[]> {
      return this.dataService.findAll(limit ? parseInt(limit, 10) : 100);
   }

   @Get('latest')
   async findLatest(): Promise<Data | null> {
      return this.dataService.findLatest();
   }
}