// components/ReadingsTable.tsx
import { Reading } from '@/lib/types';

interface ReadingsTableProps {
   readings: Reading[];
}

export default function ReadingsTable({ readings }: ReadingsTableProps) {
   return (
      <div className="overflow-x-auto">
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
               <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Sensor Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Voltage (V)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Current (A)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Power (W)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Energy (Wh)
                  </th>
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
               {readings.map((reading) => (
                  <tr key={reading._id}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reading.timestamp).toLocaleString()}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.sensorType}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.voltage !== undefined ? reading.voltage.toFixed(2) : '-'}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.current !== undefined ? reading.current.toFixed(2) : '-'}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.power !== undefined ? reading.power.toFixed(2) : '-'}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.energy !== undefined ? reading.energy.toFixed(2) : '-'}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}