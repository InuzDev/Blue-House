// app/readings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ReadingsTable from '@/components/ReadingsTable';
import { fetchReadings } from '@/lib/api';
import { Reading } from '@/lib/types';

export default function Readings() {
   const [readings, setReadings] = useState<Reading[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [limit, setLimit] = useState<number>(50);

   useEffect(() => {
      async function loadData() {
         try {
            setLoading(true);
            const data = await fetchReadings(limit);
            setReadings(data);
            setError(null);
         } catch (err) {
            console.error('Failed to load data:', err);
            setError('Failed to load readings. Please check your connection.');
         } finally {
            setLoading(false);
         }
      }

      loadData();
   }, [limit]);

   return (
      <>
         <h1 className="text-2xl font-bold mb-6">Historical Readings</h1>

         <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-semibold">Sensor Data</h2>

               <div className="flex items-center space-x-2">
                  <label htmlFor="limit" className="text-sm text-gray-600">Show:</label>
                  <select
                     id="limit"
                     className="border rounded-md p-2 text-sm"
                     value={limit}
                     onChange={(e) => setLimit(Number(e.target.value))}
                  >
                     <option value={20}>Last 20 readings</option>
                     <option value={50}>Last 50 readings</option>
                     <option value={100}>Last 100 readings</option>
                  </select>
               </div>
            </div>

            {loading && <p className="text-gray-500">Loading readings...</p>}

            {error && (
               <div className="bg-red-50 p-4 rounded-md mb-6">
                  <p className="text-red-700">{error}</p>
               </div>
            )}

            {!loading && !error && (
               readings.length > 0 ? (
                  <ReadingsTable readings={readings} />
               ) : (
                  <p className="text-gray-500">No readings found.</p>
               )
            )}
         </div>
      </>
   );
}