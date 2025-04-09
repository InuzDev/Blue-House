// lib/types.ts
export interface Reading {
   _id: string;
   sensorType: string;
   value?: number;
   voltage?: number;
   current?: number;
   power?: number;
   energy?: number;
   timestamp: string;
}

export interface EnergyConsumptionData {
   date: string;
   consumption: number;
}