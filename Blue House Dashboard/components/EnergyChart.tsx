// components/EnergyChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { EnergyConsumptionData } from '@/lib/types';

// Register all Chart.js components
Chart.register(...registerables);

interface EnergyChartProps {
   data: EnergyConsumptionData[];
}

export default function EnergyChart({ data }: EnergyChartProps) {
   const chartRef = useRef<HTMLCanvasElement>(null);
   const chartInstance = useRef<Chart | null>(null);

   useEffect(() => {
      if (!data || data.length === 0 || !chartRef.current) return;

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Destroy previous chart if it exists
      if (chartInstance.current) {
         chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = new Chart(ctx, {
         type: 'line',
         data: {
            labels: data.map(item => item.date),
            datasets: [{
               label: 'Energy Consumption (kWh)',
               data: data.map(item => item.consumption),
               borderColor: '#3b82f6',
               backgroundColor: 'rgba(59, 130, 246, 0.1)',
               borderWidth: 2,
               fill: true,
               tension: 0.3
            }]
         },
         options: {
            responsive: true,
            plugins: {
               legend: {
                  display: false
               },
               tooltip: {
                  mode: 'index' as const,
                  intersect: false
               }
            },
            scales: {
               y: {
                  beginAtZero: true,
                  title: {
                     display: true,
                     text: 'kWh'
                  }
               },
               x: {
                  title: {
                     display: true,
                     text: 'Date'
                  }
               }
            }
         }
      });

      return () => {
         if (chartInstance.current) {
            chartInstance.current.destroy();
         }
      };
   }, [data]);

   return (
      <div className="w-full">
         <canvas ref={chartRef} height={300}></canvas>
      </div>
   );
}