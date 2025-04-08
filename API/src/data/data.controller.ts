import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
   constructor(private readonly dataService: DataService) { }

   @Post()
   async create(@Body() createDataDto: { SensorType: string; value: number }) {
      return this.dataService.create(createDataDto);
   }

   @Get()
   async findAll() {
      return this.dataService.findAll();
   }
}
