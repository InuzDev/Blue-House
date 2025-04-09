'use client';

export default function Settings() {
   return (
      <>
         <h1 className="text-2xl font-bold mb-6">Settings</h1>

         <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Energy Monitor Configuration</h2>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Endpoint
                     </label>
                     <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        defaultValue="http://localhost:3000"
                        readOnly
                     />
                     <p className="mt-1 text-xs text-gray-500">
                        The URL of your Nest.js API
                     </p>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Refresh Interval (seconds)
                     </label>
                     <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        defaultValue={30}
                        min={5}
                        max={300}
                     />
                     <p className="mt-1 text-xs text-gray-500">
                        How often to fetch new data from the API
                     </p>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Alert Threshold Settings
                  </label>
                  <div className="space-y-2">
                     <div className="flex items-center">
                        <span className="w-32">Voltage Low:</span>
                        <input
                           type="number"
                           className="w-24 p-2 border rounded-md"
                           defaultValue={110}
                        />
                        <span className="ml-2">V</span>
                     </div>
                     <div className="flex items-center">
                        <span className="w-32">Voltage High:</span>
                        <input
                           type="number"
                           className="w-24 p-2 border rounded-md"
                           defaultValue={130}
                        />
                        <span className="ml-2">V</span>
                     </div>
                     <div className="flex items-center">
                        <span className="w-32">Current High:</span>
                        <input
                           type="number"
                           className="w-24 p-2 border rounded-md"
                           defaultValue={15}
                        />
                        <span className="ml-2">A</span>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end">
                  <button
                     type="button"
                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                     Save Settings
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}