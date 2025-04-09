// lib/api.ts
import { EnergyConsumptionData, Reading } from './types';

// Update this URL to match your Nest.js API endpoint
const API_URL = 'http://localhost:8000';

export async function fetchLatestReading(): Promise<Reading | null> {
   try {
      const response = await fetch(`${API_URL}/data`);

      if (!response.ok) {
         throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
   } catch (error) {
      console.error("Error fetching latest reading:", error);
      return null;
   }
}

export async function fetchReadings(limit = 100): Promise<Reading[]> {
   try {
      const response = await fetch(`${API_URL}/data?limit=${limit}`);

      if (!response.ok) {
         throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
   } catch (error) {
      console.error("Error fetching readings:", error);
      return [];
   }
}

// export async function fetchEnergyHistory(): Promise<EnergyConsumptionData[]> {
//    try {
//       // This endpoint would need to be implemented in your Nest.js API
//       const response = await fetch(`${API_URL}/energy/consumption/day`);

//       if (!response.ok) {
//          throw new Error(`API request failed with status ${response.status}`);
//       }

//       return await response.json();
//    } catch (error) {
//       console.error("Error fetching energy history:", error);
//       return [];
//    }
// }