import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">联图NEXUS-BMO运营平台</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索政策、企业..." 
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">王总</p>
            <p className="text-xs text-gray-500">超级管理员</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;