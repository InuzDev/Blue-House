import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Data extends Document {
   @Prop()
   sensor: string;

   @Prop()
   value: number;

   @Prop({ default: Date.now })
   timestamp: Date;
}

export const DataSchema = SchemaFactory.createForClass(Data);
