'use client'



import StatCards from './StatCards';
import RecentTable from './RecentTables';




export default function FirstView() {


  return (
    <div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* STAT CARDS */}
            <StatCards/>

            {/* RECENT ACTIVITY TABLE */}
           <RecentTable/>

          </div>
        </div>
      </main>
    </div>
  )
}