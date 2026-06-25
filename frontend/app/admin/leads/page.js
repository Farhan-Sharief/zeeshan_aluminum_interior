'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getContacts, markContactRead, deleteContact, exportContactsCSV } from '@/lib/api';
import toast from 'react-hot-toast';
import { HiDownload, HiTrash, HiCheck, HiMail, HiPhone, HiChat } from 'react-icons/hi';

const fallbackLeads = [
  { _id: 'l1', name: 'Amit Sharma', phone: '+91 98765 43210', email: 'amit@gmail.com', service: 'TV Cabinet Design', message: 'Hi Zeeshan, I want a modern TV cabinet built for my hall. Size is about 8x6 feet. Send design options and price estimate.', createdAt: '2026-06-07T14:30:00.000Z', isRead: false },
  { _id: 'l2', name: 'Sneha Reddy', phone: '+91 91234 56789', email: 'sneha@reddy.com', service: 'Aluminum Fabrication', message: 'Hello, need sliding aluminum windows and acoustic glass partitions for our software office layout. Quick site inspection is required.', createdAt: '2026-06-06T09:15:00.000Z', isRead: false },
  { _id: 'l3', name: 'Vikram Singh', phone: '+91 88888 77777', email: '', service: 'Interior Design', message: 'Hi team, looking for master bedroom wardrobes and fall ceiling work. Call me to discuss.', createdAt: '2026-06-04T16:00:00.000Z', isRead: true }
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'read'

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab === 'unread') params.isRead = false;
      if (activeTab === 'read') params.isRead = true;
      
      const res = await getContacts(params);
      if (res.data?.success) {
        setLeads(res.data.data);
      } else {
        setLeads(fallbackLeads);
      }
    } catch {
      setLeads(fallbackLeads);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleMarkRead = async (id) => {
    try {
      const res = await markContactRead(id);
      if (res.data?.success) {
        setLeads(prev => prev.map(lead => lead._id === id ? { ...lead, isRead: true } : lead));
        toast.success('Inquiry marked as read.');
      }
    } catch {
      toast.error('Failed to mark as read. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await deleteContact(id);
      if (res.data?.success) {
        toast.success('Inquiry deleted.');
        fetchLeads();
      }
    } catch {
      toast.error('Failed to delete inquiry. Please try again.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await exportContactsCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'zeeshan-leads.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Exported CSV successfully!');
    } catch {
      // Offline fallback: Generate raw CSV directly from client state
      const headers = ['Name', 'Phone', 'Email', 'Service', 'Message', 'Date', 'Status'];
      const rows = leads.map(l => [
        `"${l.name}"`,
        `"${l.phone}"`,
        `"${l.email || ''}"`,
        `"${l.service || 'N/A'}"`,
        `"${l.message.replace(/"/g, '""')}"`,
        `"${new Date(l.createdAt).toLocaleDateString()}"`,
        l.isRead ? 'Read' : 'Unread'
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'zeeshan-leads-demo.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Exported CSV successfully (Demo Mode)!');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-charcoal">Customer Inquiries</h1>
            <p className="text-silver text-sm">Review lead form submissions, phone inquiries, and messages</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="btn-primary flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-green-600/10"
          >
            <HiDownload size={18} />
            Export CSV
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-gray-200">
          {['all', 'unread', 'read'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 border-b-2 font-medium text-sm uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'border-gold text-gold'
                  : 'border-transparent text-silver hover:text-charcoal'
              }`}
            >
              {tab} Inquiries
            </button>
          ))}
        </div>

        {/* Inquiries list cards */}
        {loading ? (
          <div className="flex items-center justify-center h-[40vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className={`bg-white rounded-xl p-6 border transition-shadow shadow-sm hover:shadow-md ${
                  !lead.isRead ? 'border-l-4 border-l-gold border-gray-100' : 'border-gray-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Lead information */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-lg text-charcoal">{lead.name}</h3>
                      {lead.service && (
                        <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-600 font-semibold text-xs rounded uppercase">
                          {lead.service}
                        </span>
                      )}
                      {!lead.isRead && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-silver">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-gold">
                        <HiPhone size={14} className="text-gold" />
                        <span>{lead.phone}</span>
                      </a>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-gold">
                          <HiMail size={14} className="text-gold" />
                          <span>{lead.email}</span>
                        </a>
                      )}
                      <span className="flex items-center gap-1.5">
                        <HiChat size={14} className="text-gold" />
                        <span>
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </span>
                    </div>

                    <p className="text-sm text-charcoal/70 bg-cream/30 p-4 rounded-lg border border-gray-50 leading-relaxed font-light">
                      {lead.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 self-end md:self-start">
                    {!lead.isRead && (
                      <button
                        onClick={() => handleMarkRead(lead._id)}
                        className="px-3 py-1.5 bg-gold/10 hover:bg-gold text-gold hover:text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors border border-gold/10"
                        title="Mark as Read"
                      >
                        <HiCheck size={16} />
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-50 border border-gray-100 rounded transition-colors"
                      title="Delete inquiry"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {leads.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-silver text-sm">
                No inquiries found matching this tab filters.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
