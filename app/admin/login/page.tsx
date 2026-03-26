'use client';

import { Smartphone } from 'lucide-react';
import LoginForm from '@/components/admin/LoginForm';
import { adminLogin } from '@/lib/admin-api';

export default function AdminLoginPage() {
  const handleLogin = async (username: string, password: string) => {
    const result = await adminLogin(username, password);
    localStorage.setItem('admin_token', result.token);
    localStorage.setItem('admin_name', result.admin.name);
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-forest rounded-xl mb-4">
            <Smartphone size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tunisia Phone</h1>
          <p className="text-gray-500 mt-1">Panneau d&apos;administration</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Connexion</h2>
          <LoginForm onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
}
