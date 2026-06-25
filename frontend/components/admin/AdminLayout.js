'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getMe } from '@/lib/api';
import { HiChartBar, HiBriefcase, HiChatBubbleLeftRight, HiInboxArrowDown, HiArrowLeftOnRectangle, HiBars3, HiXMark } from 'react-icons/hi2';

const menuItems = [
  { name: 'Dashboard', icon: HiChartBar, href: '/admin/dashboard' },
  { name: 'Manage Projects', icon: HiBriefcase, href: '/admin/projects' },
  { name: 'Testimonials', icon: HiChatBubbleLeftRight, href: '/admin/testimonials' },
  { name: 'Contact Inquiries', icon: HiInboxArrowDown, href: '/admin/leads' },
];

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const res = await getMe();
        if (res.data?.success) {
          setAdmin(res.data.admin);
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } catch (err) {
        // Fallback for offline demo mode
        if (token.startsWith('mock-token')) {
          setAdmin({ name: 'Zeeshan (Demo)', username: 'admin', email: 'admin@zeeshan.com' });
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-charcoal text-white h-16 px-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">Z</span>
          </div>
          <span className="font-heading font-bold tracking-wider">ZEESHAN ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`bg-charcoal text-white w-64 flex-shrink-0 flex flex-col justify-between transition-all duration-300 z-30 fixed md:static inset-y-0 left-0 transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="h-20 border-b border-white/5 items-center gap-3 px-6 hidden md:flex">
            <div className="w-9 h-9 rounded bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-white font-heading font-bold text-base">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold tracking-wide leading-none text-sm">ZEESHAN</span>
              <span className="text-gold text-[9px] uppercase tracking-[0.2em] leading-none mt-1">Control Panel</span>
            </div>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-white/5">
            <div className="text-xs text-white/40 uppercase tracking-widest">Logged In As</div>
            <div className="font-medium mt-1 truncate text-white/90">{admin?.name || 'Administrator'}</div>
            <div className="text-xs text-gold/80 mt-0.5 truncate">{admin?.email}</div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 transition-colors"
          >
            <HiArrowLeftOnRectangle size={20} />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
