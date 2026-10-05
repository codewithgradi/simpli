'use client';

import {  useState } from 'react';
import { LayoutDashboard, Users, Hotel,HotelIcon,LogOut ,Settings, Bell,ShieldCheck, Plus } from 'lucide-react';
import FirstView from './FirstView';
import {  VisitorView } from './VisitorView';
import { ProfileView } from './Profile';
import { SettingsView } from './Settings';
import NotificationCenter from './SystemNotification';
import DashboardSkeleton from './DashboardSkeleton';
import CreateRoomModal from './CreateRoomModal';
import RoomManagement from './ViewRooms';
import { useRouter } from 'next/navigation';
import Notification from './Notification';
import Link from 'next/link';

export default function HotelDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
    const [loading, setLoading] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [isloggedIn,setIsLoggedIn] = useState(true)
  const router = useRouter()
  
  
  const navigation = [
    { name: 'Analytics', icon: LayoutDashboard, component: <FirstView /> },
    { name: 'Visitor Logs', icon: Users, component: <VisitorView /> },
    { name: 'Hotel Profile', icon: Hotel, component: <ProfileView /> },
    { name: 'Settings', icon: Settings, component: <SettingsView /> },
    { name: 'Rooms', icon: HotelIcon, component: <RoomManagement /> },
  ];

  const renderContent = () => {
    const activeItem = navigation.find((item) => item.name === activeTab);
    return activeItem ? activeItem.component : <FirstView />;
  };
 const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;
  
  const handleLogOut = async() => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:'include',
      })
      if (!res.ok) { console.log(res) }
      setIsLoggedIn(false)
      router.push('/login')
      
    } catch (error) {
      console.log(error)
     }
  }

  
  if(!isloggedIn) return(<Notification onClose={()=>setIsLoggedIn(false)} message='logged out successfully' type='positive'/>)
  if(loading) return <DashboardSkeleton/>

  return (
    <div className="flex h-screen bg-white font-sans text-[#001e2b]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#001e2b] flex flex-col border-r border-gray-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00ed64] rounded flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#001e2b]" />
          </div>
          <span className="text-white font-bold tracking-tight text-xl">SIMPLY</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === item.name
                  ? 'bg-[#00ed64]/10 text-[#00ed64] border-l-4 border-[#00ed64]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs text-gray-500">
          v2.4.0-production
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER - Consistent with MongoDB Atlas style */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white z-10">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-bold text-[#001e2b] tracking-tight uppercase text-xs">
              {activeTab}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={()=>setShowModal(true)}
              className="bg-[#00ed64] hover:bg-[#00c654] text-[#001e2b] px-4 py-1.5 rounded font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <Plus size={18} className="text-gray-400 cursor-pointer hover:text-[#00ed64]" />
             <p>Create a room</p>
            </button>
            <Link
              href={'/console/scan'}
              className="bg-green-800 text-white hover:bg-green-900 px-4 py-1.5 rounded font-bold text-xs flex items-center gap-2 transition-colors"
            >
             <p>Go to Scanner</p>
            </Link>
            <div className='relative'>
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 text-gray-400 hover:text-[#00ed64] transition-colors"
            >
              <Bell size={20} />
              {/* The Red Dot Indicator */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <NotificationCenter 
              isOpen={showNotifs} 
              onClose={() => setShowNotifs(false)} 
            />  
            </div>

            <div className="w-8 h-8 bg-[#00684a] rounded-full border border-gray-200 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <button
              onClick={handleLogOut}
              className='flex items-center justify-between space-x-3 font-bold rounded-b-md rounded-t-md text-white opacity-65 bg-red-400 px-2 py-1 hover:bg-red-900'>
              <p>Log out</p>
              <LogOut/>
            </button>
          </div>
        </header>

        {/* COMPONENT RENDERER */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {renderContent()}
            <NotificationCenter
              isOpen={showNotifs} 
              onClose={() => setShowNotifs(false)}
            />
          </div>
        </div>
      </main>
      <CreateRoomModal isOpen={ showModal} onClose={()=>setShowModal(false)} />
    </div>
  );
}