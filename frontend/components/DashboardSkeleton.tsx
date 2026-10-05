const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-50 animate-pulse">
      {/* 1. Sidebar Skeleton */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="h-8 bg-gray-200 rounded w-32 mb-10"></div> {/* Logo */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* 2. Top Navigation Skeleton */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div> {/* Profile */}
        </header>

        {/* 3. Main Content Area */}
        <main className="p-8 space-y-8 overflow-auto">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white border border-gray-200 rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>

          {/* Large Chart Area (Where your Bar/Line charts go) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="h-5 bg-gray-200 rounded w-40 mb-8"></div>
              <div className="h-64 bg-gray-100 rounded-lg w-full"></div> {/* Chart placeholder */}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="h-5 bg-gray-200 rounded w-32 mb-8"></div>
              <div className="h-64 bg-gray-100 rounded-lg w-full"></div> {/* Chart placeholder */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;