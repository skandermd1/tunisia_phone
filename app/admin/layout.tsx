'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ToastContainer, { useToast } from '@/components/ui/Toast';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Tableau de bord',
  '/admin/commandes': 'Commandes',
  '/admin/produits': 'Produits',
  '/admin/produits/nouveau': 'Nouveau produit',
  '/admin/marques': 'Marques',
  '/admin/categories': 'Categories',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [storedName, setStoredName] = useState('Admin');
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, dismissToast } = useToast();

  useEffect(() => {
    setToken(localStorage.getItem('admin_token'));
    setStoredName(localStorage.getItem('admin_name') || 'Admin');
    setHydrated(true);
  }, [pathname]);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (hydrated && !isLoginPage && !token) {
      router.replace('/admin/login');
    }
  }, [hydrated, isLoginPage, token, router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    router.replace('/admin/login');
  }, [router]);

  if (!hydrated || (!isLoginPage && !token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Login page has its own layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  const pageTitle = PAGE_TITLES[pathname] || (
    pathname.startsWith('/admin/commandes/') ? 'Detail commande' :
    pathname.includes('/modifier') ? 'Modifier produit' :
    'Administration'
  );

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="lg:ml-64">
        <AdminHeader
          title={pageTitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          adminName={storedName}
        />
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
