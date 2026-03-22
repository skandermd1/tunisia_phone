'use client';

import { Menu, LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  onMenuToggle: () => void;
  onLogout: () => void;
  adminName?: string;
}

export default function AdminHeader({ title, onMenuToggle, onLogout, adminName = 'Admin' }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>{adminName}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Deconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
