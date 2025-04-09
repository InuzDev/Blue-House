// components/GaugeCard.tsx
interface GaugeCardProps {
   title: string;
   value: number;
   unit: string;
   min: number;
   max: number;
   lowThreshold?: number;
   highThreshold?: number;
}

export default function GaugeCard({
   title,
   value,
   unit,
   min,
   max,
   lowThreshold,
   highThreshold
}: GaugeCardProps) {
   // Calculate percentage for gauge display
   const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

   // Determine color based on thresholds
   let color = 'text-green-500';
   if (lowThreshold !== undefined && value < lowThreshold) {
      color = 'text-yellow-500';
   }
   if (highThreshold !== undefined && value > highThreshold) {
      color = 'text-red-500';
   }

   return (
      <div className="bg-white rounded-lg shadow p-6">
         <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

         {/* Gauge visualization */}
         <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
               className={`absolute top-0 left-0 h-full ${color.replace('text', 'bg')}`}
               style={{ width: `${percentage}%` }}
            ></div>
         </div>

         <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>{min} {unit}</span>
            <span>{max} {unit}</span>
         </div>

         <div className="flex items-baseline">
            <span className={`text-3xl font-bold ${color}`}>
               {value.toFixed(1)}
            </span>
            <span className="ml-1 text-gray-500">{unit}</span>
         </div>
      </div>
   );
}