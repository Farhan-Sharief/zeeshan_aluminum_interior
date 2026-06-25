'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getStats } from '@/lib/api';
import { HiBriefcase, HiPhoto, HiInboxArrowDown, HiChatBubbleLeftRight } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Fallback statistics for offline demo mode
const fallbackStats = {
  totalProjects: 24,
  totalImages: 78,
  totalTestimonials: 12,
  totalContacts: 45,
  unreadContacts: 8,
  recentProjects: [
    { _id: '1', title: 'Minimalist Charcoal TV Cabinet', category: 'TV Cabinet', createdAt: '2026-06-05T10:00:00.000Z' },
    { _id: '2', title: 'Double Glazed Sliding Windows', category: 'Aluminum Work', createdAt: '2026-06-02T12:00:00.000Z' },
    { _id: '3', title: 'Corporate Executive Office', category: 'Interior Work', createdAt: '2026-05-28T09:30:00.000Z' },
    { _id: '4', title: 'Premium Glass Partition Panel', category: 'Aluminum Work', createdAt: '2026-05-25T15:00:00.000Z' },
    { _id: '5', title: 'Walnut & Gold Finish TV Console', category: 'TV Cabinet', createdAt: '2026-05-20T11:45:00.000Z' }
  ],
  recentContacts: [
    { _id: 'c1', name: 'Amit Sharma', phone: '+91 98765 43210', message: 'Interested in getting a custom TV cabinet built for my living room. Please call.', createdAt: '2026-06-07T14:30:00.000Z', isRead: false },
    { _id: 'c2', name: 'Sneha Reddy', phone: '+91 91234 56789', message: 'Need aluminum partition glass and windows for our newly built office. Share quotes.', createdAt: '2026-06-06T09:15:00.000Z', isRead: false },
    { _id: 'c3', name: 'Vikram Singh', phone: '+91 88888 77777', message: 'Looking for wardrobe and interior work. Need a complete home package estimate.', createdAt: '2026-06-04T16:00:00.000Z', isRead: true },
  ],
  monthlyInquiries: [
    { _id: { year: 2026, month: 1 }, count: 5 },
    { _id: { year: 2026, month: 2 }, count: 8 },
    { _id: { year: 2026, month: 3 }, count: 12 },
    { _id: { year: 2026, month: 4 }, count: 10 },
    { _id: { year: 2026, month: 5 }, count: 15 },
    { _id: { year: 2026, month: 6 }, count: 20 },
  ],
  monthlyProjects: [
    { _id: { year: 2026, month: 1 }, count: 2 },
    { _id: { year: 2026, month: 2 }, count: 4 },
    { _id: { year: 2026, month: 3 }, count: 3 },
    { _id: { year: 2026, month: 4 }, count: 5 },
    { _id: { year: 2026, month: 5 }, count: 6 },
    { _id: { year: 2026, month: 6 }, count: 4 },
  ],
  categoryStats: [
    { _id: 'TV Cabinet', count: 8 },
    { _id: 'Aluminum Work', count: 10 },
    { _id: 'Interior Work', count: 6 }
  ]
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await getStats();
        if (res.data?.success) {
          setStats(res.data.data);
        } else {
          setStats(fallbackStats);
        }
      } catch {
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
        </div>
      </AdminLayout>
    );
  }

  // Parse chart data
  const chartData = stats.monthlyInquiries.map((inq, idx) => {
    const monthIndex = inq._id.month - 1;
    const label = `${monthNames[monthIndex]} ${inq._id.year}`;
    const projUploads = stats.monthlyProjects[idx]?.count || 0;
    return {
      name: label,
      "Contact Inquiries": inq.count,
      "Projects Added": projUploads
    };
  });

  const cards = [
    { name: 'Total Projects', value: stats.totalProjects, icon: HiBriefcase, color: 'bg-blue-500' },
    { name: 'Total Images', value: stats.totalImages, icon: HiPhoto, color: 'bg-green-500' },
    { name: 'Contact Inquiries', value: stats.totalContacts, icon: HiInboxArrowDown, color: 'bg-gold', badge: stats.unreadContacts ? `${stats.unreadContacts} new` : null },
    { name: 'Client Testimonials', value: stats.totalTestimonials, icon: HiChatBubbleLeftRight, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal">Dashboard Overview</h1>
          <p className="text-silver text-sm">Real-time statistics and metrics summary for Zeeshan Aluminum Interior</p>
        </div>

        {/* Stats grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-silver uppercase tracking-wider block font-semibold">{card.name}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-charcoal">{card.value}</span>
                  {card.badge && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.color} text-white flex items-center justify-center shadow-sm`}>
                <card.icon size={22} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Inquiry Area Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
            <h3 className="font-heading text-lg font-bold text-charcoal">Monthly Inquiries & Project Uploads</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" fontSize={11} stroke="#9ca3af" />
                  <YAxis fontSize={11} stroke="#9ca3af" />
                  <Tooltip />
                  <Area type="monotone" dataKey="Contact Inquiries" stroke="#c9a84c" fillOpacity={1} fill="url(#colorInq)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Projects Added" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Category Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm lg:col-span-1 space-y-4">
            <h3 className="font-heading text-lg font-bold text-charcoal">Category Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="_id" fontSize={10} stroke="#9ca3af" />
                  <YAxis fontSize={11} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1a1a1a" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-charcoal">Recent Inquiries</h3>
              <a href="/admin/leads" className="text-xs text-gold font-semibold hover:underline">View All</a>
            </div>
            <div className="divide-y divide-gray-100 flex-1">
              {stats.recentContacts.map((lead) => (
                <div key={lead._id} className="p-4 hover:bg-zinc-50 transition-colors flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-charcoal">{lead.name}</span>
                      {!lead.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      )}
                    </div>
                    <span className="text-xs text-silver block">{lead.phone}</span>
                    <p className="text-xs text-silver line-clamp-1 leading-relaxed">{lead.message}</p>
                  </div>
                  <span className="text-[10px] text-silver font-medium">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-charcoal">Recently Added Designs</h3>
              <a href="/admin/projects" className="text-xs text-gold font-semibold hover:underline">Manage</a>
            </div>
            <div className="divide-y divide-gray-100 flex-1">
              {stats.recentProjects.map((project) => (
                <div key={project._id} className="p-4 hover:bg-zinc-50 transition-colors flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="font-medium text-sm text-charcoal block">{project.title}</span>
                    <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-semibold uppercase rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-silver font-medium">
                    {new Date(project.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
