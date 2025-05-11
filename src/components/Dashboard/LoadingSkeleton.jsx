import React from "react";

const LoadingSkeleton = ({ isDark }) => {
  const skeletonBgColor = isDark ? "bg-gray-700" : "bg-gray-200";
  const bgColor = isDark ? "bg-gray-800" : "bg-white";
  const pageBackground = isDark ? "bg-gray-900" : "bg-gray-100";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  
  return (
    <div>
      <div className={`w-full h-full p-6 overflow-auto ${pageBackground}`}>
        {/* Dashboard Title Skeleton */}
        <div className={`${skeletonBgColor} h-8 w-40 rounded-md mb-6 mt-10 md:mt-0 animate-pulse`} />
        
        {/* Account Selection Dropdowns Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className={`${skeletonBgColor} h-10 rounded-md animate-pulse`} />
          <div className={`${skeletonBgColor} h-10 rounded-md animate-pulse`} />
          <div className={`${skeletonBgColor} h-10 rounded-md animate-pulse`} />
        </div>
        
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className={`${bgColor} p-4 rounded-lg shadow animate-pulse`}>
              <div className="flex items-center mb-2">
                <div className={`${skeletonBgColor} h-6 w-6 rounded-full mr-2`} />
                <div className={`${skeletonBgColor} h-4 w-24 rounded-md`} />
              </div>
              <div className={`${skeletonBgColor} h-8 w-16 rounded-md mt-2`} />
              <div className={`${skeletonBgColor} h-3 w-full rounded-md mt-3`} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 p-6">
        {/* Charts Section Skeleton */}
        <div className="xl:col-span-3 space-y-6">
          {/* Performance Chart Skeleton */}
          <div className={`${bgColor} rounded-lg shadow p-4`}>
            <div className="flex justify-between items-center mb-4">
              <div className={`${skeletonBgColor} h-6 w-40 rounded-md animate-pulse`} />
              <div className={`${skeletonBgColor} h-8 w-32 rounded-md animate-pulse`} />
            </div>
            <div className={`${skeletonBgColor} h-[300px] rounded-md animate-pulse`} />
          </div>
          
          {/* Recent Trades Skeleton */}
          <div className={`${bgColor} rounded-lg shadow`}>
            <div className={`p-4 border-b ${borderColor}`}>
              <div className={`${skeletonBgColor} h-6 w-32 rounded-md animate-pulse`} />
            </div>
            <div className="divide-y">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="p-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className={`${skeletonBgColor} h-8 w-8 rounded-full mr-3 animate-pulse`} />
                      <div>
                        <div className={`${skeletonBgColor} h-4 w-24 rounded-md mb-1 animate-pulse`} />
                        <div className={`${skeletonBgColor} h-3 w-16 rounded-md animate-pulse`} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`${skeletonBgColor} h-4 w-20 rounded-md mb-1 animate-pulse`} />
                      <div className={`${skeletonBgColor} h-3 w-12 rounded-md animate-pulse`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 border-t ${borderColor}`}>
              <div className={`${skeletonBgColor} h-4 w-32 rounded-md animate-pulse`} />
            </div>
          </div>
        </div>
        
        {/* Side Section Skeleton */}
        <div className="xl:col-span-2 space-y-6">
          {/* Win/Loss Distribution Skeleton */}
          <div className={`${bgColor} rounded-lg shadow p-4`}>
            <div className={`${skeletonBgColor} h-6 w-48 rounded-md mb-4 animate-pulse`} />
            <div className={`${skeletonBgColor} h-64 rounded-md animate-pulse`} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={`${skeletonBgColor} h-16 rounded-md animate-pulse`} />
              <div className={`${skeletonBgColor} h-16 rounded-md animate-pulse`} />
            </div>
          </div>
          
          {/* Market Events Skeleton */}
          <div className={`${bgColor} rounded-lg shadow`}>
            <div className={`p-4 border-b ${borderColor}`}>
              <div className={`${skeletonBgColor} h-6 w-48 rounded-md animate-pulse`} />
            </div>
            <div className="divide-y">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="p-3">
                  <div className="flex items-center">
                    <div className={`${skeletonBgColor} h-8 w-8 rounded-full mr-3 animate-pulse`} />
                    <div className="flex-1">
                      <div className={`${skeletonBgColor} h-4 w-32 rounded-md mb-1 animate-pulse`} />
                      <div className={`${skeletonBgColor} h-3 w-24 rounded-md animate-pulse`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 border-t ${borderColor}`}>
              <div className={`${skeletonBgColor} h-4 w-40 rounded-md animate-pulse`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;