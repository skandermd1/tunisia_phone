'use client';

import { useSyncExternalStore, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ToastContainer, { useToast } from '@/components/ui/Toast';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Tableau de bord',
  '/admin/commandes': 'Commandes',
  '/admin/produits': 'Produits',
  '/admin/produits/nouveau': 'Nouveau produit',
};

function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

function getAdminName() {
  if (typeof window === 'undefined') return 'Admin';
  return localStorage.getItem('admin_name') || 'Admin';
}

// Subscribe is a no-op since localStorage doesn't fire events in the same tab
const subscribe = () => () => {};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSyncExternalStore(subscribe, getAdminToken, () => null);
  const storedName = useSyncExternalStore(subscribe, getAdminName, () => 'Admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, dismissToast } = useToast();

  const isLoginPage = pathname === '/admin/login';
  const authenticated = isLoginPage || !!token;

  if (!isLoginPage && !token) {
    // Redirect on next tick to avoid setState-in-render issues
    if (typeof window !== 'undefined') {
      router.replace('/admin/login');
    }
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    router.replace('/admin/login');
  }, [router]);

  if (!authenticated) {
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
