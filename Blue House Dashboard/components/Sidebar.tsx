'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
   const pathname = usePathname();

   const isActive = (path: string) => pathname === path;

   return (
      <aside className="w-64 bg-blue-800 text-white hidden md:flex flex-col">
         <div className="p-6 border-b border-blue-700">
            <h1 className="text-xl font-bold">Blue House - DashBoard</h1>
         </div>

         <nav className="flex-1 p-4">
            <ul className="space-y-2">
               <li>
                  <Link href="/" className={`block p-3 rounded-md ${isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                     Dashboard
                  </Link>
               </li>
               <li>
                  <Link href="/readings" className={`block p-3 rounded-md ${isActive('/readings') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                     Historical Readings
                  </Link>
               </li>
               <li>
                  <Link href="/settings" className={`block p-3 rounded-md ${isActive('/settings') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                     Settings
                  </Link>
               </li>
            </ul>
         </nav>

         <div className="p-4 border-t border-blue-700 text-xs">
            <p>Blue House - Smart Energy Monitor v1.0</p>
         </div>
      </aside>
   );
}