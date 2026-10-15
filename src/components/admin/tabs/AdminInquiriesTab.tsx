import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { CustomerInquiry } from '../../../types';
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Trash2,
  ExternalLink,
  X,
  User,
  Package,
  Plus,
} from 'lucide-react';

export const AdminInquiriesTab: React.FC = () => {
  const { inquiries, addInquiry, updateInquiryStatus, deleteInquiry, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CustomerInquiry['status']>('All');
  const [inquiryToDelete, setInquiryToDelete] = useState<CustomerInquiry | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // New Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubject, setLeadSubject] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadProduct, setLeadProduct] = useState('T-Shirt Printing');

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = inq.customerName.toLowerCase().includes(q);
        const matchPhone = inq.phone.includes(q);
        const matchSubj = inq.subject.toLowerCase().includes(q);
        const matchMsg = inq.message.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchSubj && !matchMsg) return false;
      }

      if (statusFilter !== 'All' && inq.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [inquiries, searchQuery, statusFilter]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      addToast('Please enter customer name and phone', 'error');
      return;
    }

    addInquiry({
      customerName: leadName.trim(),
      phone: leadPhone.startsWith('+91') ? leadPhone.trim() : `+91 ${leadPhone.trim()}`,
      email: leadEmail.trim() || undefined,
      subject: leadSubject.trim() || `Inquiry for ${leadProduct}`,
      message: leadMessage.trim() || 'Inquired via phone/walk-in regarding custom printing price and timeline.',
      preferredProduct: leadProduct,
    });

    setIsAddLeadModalOpen(false);
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setLeadSubject('');
    setLeadMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display font-black text-stone-900 uppercase">
              Customer Leads & Quotes
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 font-mono">
              {inquiries.length} Total
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Incoming custom printing quote requests and WhatsApp inquiries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, phone..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 outline-none focus:border-stone-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
        {(['All', 'New', 'Contacted', 'Quoted', 'Closed'] as const).map((status) => {
          const count =
            status === 'All'
              ? inquiries.length
              : inquiries.filter((inq) => inq.status === status).length;
          const isSelected = statusFilter === status;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inquiries Cards List */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200 space-y-3">
          <MessageSquare className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="font-display font-bold text-stone-800 text-base">
            {inquiries.length === 0 ? 'No Customer Leads Recorded' : 'No Matching Leads'}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            {inquiries.length === 0
              ? 'When customers submit inquiries from your Contact Desk or click WhatsApp links on products, their details will appear here.'
              : 'Try changing your search query or status filter.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Walk-in / Telephone Inquiry</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inq) => {
            const dateStr = new Date(inq.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={inq.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-amber-400 transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center font-display">
                      {inq.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{inq.customerName}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        inq.status === 'New'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : inq.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : inq.status === 'Quoted'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {inq.status}
                    </span>

                    {inq.preferredProduct && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">
                        {inq.preferredProduct}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/80 text-xs space-y-1">
                  <div className="font-bold text-stone-900">{inq.subject}</div>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                    {inq.message}
                  </p>
                </div>

                {/* Customer Contact & Status Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3 text-stone-600">
                    <span className="font-mono font-bold text-stone-900 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {inq.phone}
                    </span>
                    {inq.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        {inq.email}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {/* 1-Click WhatsApp Button with pre-filled message */}
                    <a
                      href={`https://wa.me/${inq.phone.replace(
                        /\D/g,
                        ''
                      )}?text=Hello%20${encodeURIComponent(
                        inq.customerName
                      )}%2C%20Pro.%20Shaikh%20Sameer%20from%20JR%20Printing%20Works%20replying%20to%20your%20inquiry%20regarding%20${encodeURIComponent(
                        inq.preferredProduct || inq.subject
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Reply</span>
                    </a>

                    <select
                      value={inq.status}
                      onChange={(e) =>
                        updateInquiryStatus(inq.id, e.target.value as CustomerInquiry['status'])
                      }
                      className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <button
                      onClick={() => setInquiryToDelete(inq)}
                      className="p-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-400 transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal (In-App, No window.confirm) */}
      {inquiryToDelete && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-base text-stone-900">
                Delete lead from {inquiryToDelete.customerName}?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Phone: <strong>{inquiryToDelete.phone}</strong>. This lead record will be deleted.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setInquiryToDelete(null)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteInquiry(inquiryToDelete.id);
                  setInquiryToDelete(null);
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-display font-black text-base text-stone-900 uppercase">
                Record Customer Inquiry / Lead
              </h3>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Rahul Patil"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="e.g. 9822012345"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Service / Product Interested</label>
                <select
                  value={leadProduct}
                  onChange={(e) => setLeadProduct(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-semibold"
                >
                  <option value="T-Shirt Printing">👕 T-Shirt Printing</option>
                  <option value="Cup & Magic Mug Printing">☕ Cup & Magic Mug Printing</option>
                  <option value="Pillow & Cushion Printing">🛋️ Pillow & Cushion Printing</option>
                  <option value="Bottle Printing">🍾 Bottle Printing</option>
                  <option value="Photo Frame Printing">🖼️ Photo Frame Printing</option>
                  <option value="Key Chain Printing">🔑 Key Chain Printing</option>
                  <option value="Mobile Back Covers">📱 Mobile Back Covers</option>
                  <option value="Bulk Corporate / Collab">🏢 Bulk Corporate / Collab</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subject / Requirement Headline</label>
                <input
                  type="text"
                  value={leadSubject}
                  onChange={(e) => setLeadSubject(e.target.value)}
                  placeholder="e.g. 50 T-shirts for college event"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Message Notes</label>
                <textarea
                  rows={3}
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  placeholder="Details of the customer request, design notes, deadline..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-bold shadow-md transition-colors"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
