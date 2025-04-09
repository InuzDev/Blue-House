// data.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataDocument = Data & Document;

@Schema()
export class Data {
   @Prop({ required: true })
   sensorType: string;

   @Prop({ type: Number, required: false })
   value?: number;

   @Prop({ type: Number, required: false })
   voltage?: number;

   @Prop({ type: Number, required: false })
   current?: number;

   @Prop({ type: Number, required: false })
   power?: number;

   @Prop({ type: Number, required: false })
   energy?: number;

   @Prop({ default: Date.now })
   timestamp: Date;
}

export const DataSchema = SchemaFactory.createForClass(Data);