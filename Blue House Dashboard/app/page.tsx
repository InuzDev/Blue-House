// app/page.tsx
'use client';

import EnergyChart from '@/components/EnergyChart';
import GaugeCard from '@/components/GaugeCard';
import { fetchLatestReading } from '@/lib/api';
import { useEffect, useState } from 'react';
// import { fetchLatestReading, fetchEnergyHistory } from '@/lib/api';
import { EnergyConsumptionData, Reading } from '@/lib/types';

export default function Dashboard() {
  const [latestReading, setLatestReading] = useState<Reading | null>(null);
  const [energyHistory, setEnergyHistory] = useState<EnergyConsumptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // const [readingData, historyData] = await Promise.all([
        const [readingData] = await Promise.all([
          fetchLatestReading(),
          // fetchEnergyHistory()
        ]);

        setLatestReading(readingData);
        // setEnergyHistory(historyData);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Energy Monitor Dashboard</h1>

      {loading && <p className="text-gray-500">Loading data...</p>}

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && latestReading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GaugeCard
              title="Voltage"
              value={latestReading.voltage ?? 0}
              unit="V"
              min={0}
              max={150}
              lowThreshold={110}
              highThreshold={130}
            />
            <GaugeCard
              title="Current"
              value={latestReading.current ?? 0}
              unit="A"
              min={0}
              max={20}
              highThreshold={15}
            />
            <GaugeCard
              title="Power"
              value={latestReading.power ?? 0}
              unit="W"
              min={0}
              max={2000}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Energy Consumption</h2>
            {energyHistory.length > 0 ? (
              <EnergyChart data={energyHistory} />
            ) : (
              <p className="text-gray-500">No energy consumption data available.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Latest Reading</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReading.voltage !== undefined && (
                    <tr className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">Voltage</td>
                      <td className="px-6 py-4 whitespace-nowrap">{latestReading.voltage} V</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(latestReading.timestamp).toLocaleString()}</td>
                    </tr>
                  )}
                  {latestReading.current !== undefined && (
                    <tr className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">Current</td>
                      <td className="px-6 py-4 whitespace-nowrap">{latestReading.current} A</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(latestReading.timestamp).toLocaleString()}</td>
                    </tr>
                  )}
                  {latestReading.power !== undefined && (
                    <tr className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">Power</td>
                      <td className="px-6 py-4 whitespace-nowrap">{latestReading.power} W</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(latestReading.timestamp).toLocaleString()}</td>
                    </tr>
                  )}
                  {latestReading.energy !== undefined && (
                    <tr className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">Energy</td>
                      <td className="px-6 py-4 whitespace-nowrap">{latestReading.energy} Wh</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(latestReading.timestamp).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}