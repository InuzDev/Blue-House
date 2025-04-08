import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
   constructor(private readonly dataService: DataService) { }

   @Post()
   async create(@Body() createDataDto: { SensorType: string; value: number }) {
      return this.dataService.create(createDataDto);
   }

   @Post()
   async receiveArduinoData(@Body() sensorData: any) {
      console.log('Received data from microcontroller', sensorData);

      // Will now recive the data from the microcontroller.
      return this.dataService.processSensorData(sensorData)
   }

   @Get()
   async findAll() {
      return this.dataService.findAll();
   }
}
