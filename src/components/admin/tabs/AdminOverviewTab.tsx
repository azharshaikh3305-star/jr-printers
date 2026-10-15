import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { JR_INFO } from '../../../data/products';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  MessageSquare,
  Clock,
  Printer,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Plus,
  Database,
  Phone,
  ShieldCheck,
  Sparkles,
  Trash2,
  RotateCcw,
  Store,
} from 'lucide-react';
import { AdminTab, OrderStatus } from '../../../types';

interface AdminOverviewTabProps {
  setActiveTab: (tab: AdminTab) => void;
  openAddProductModal: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  setActiveTab,
  openAddProductModal,
}) => {
  const {
    orders,
    products,
    inquiries,
    updateOrderStatus,
    exportDatabaseJson,
    exportDatabaseSql,
    isLiveMode,
    clearAllDemoData,
    loadDemoData,
    databaseConfig,
    navigateTo,
    addToast,
  } = useApp();

  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Real-time calculated statistics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activePrintingCount = orders.filter(
    (o) => o.orderStatus === 'Printing' || o.orderStatus === 'Processing'
  ).length;

  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'New').length;
  const inStockProductsCount = products.filter((p) => p.inStock).length;

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jr_printing_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Database snapshot downloaded successfully!', 'success');
  };

  const handleDownloadSql = () => {
    const sqlStr = exportDatabaseSql();
    const blob = new Blob([sqlStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jr_printing_schema_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('PostgreSQL SQL Schema & Dump downloaded!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Store Status Banner */}
      <div className="bg-gradient-to-r from-[#2B0411] via-[#3E0619] to-[#1E020B] text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-rose-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest font-mono">
              Live Printing Studio Desk
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                orders.length === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
              }`}
            >
              {orders.length === 0 ? '✓ Ready For Live Customers' : 'Active Store Operations'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-display tracking-tight text-white">
            Welcome, Shaikh Sameer!
          </h2>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            JR PRINTING WORKS official management cockpit. All orders, customer inquiries, and custom artwork sync directly with your live customer storefront.
          </p>
        </div>

        {/* Action Controls in Header */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={openAddProductModal}
            className="flex-1 md:flex-none px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className="flex-1 md:flex-none px-3.5 py-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Orders ({orders.length})</span>
          </button>

          {orders.length > 0 && (
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="flex-1 md:flex-none px-3 py-2.5 bg-rose-950/60 hover:bg-rose-900/90 text-rose-200 border border-rose-800/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Clear dummy/test data and start completely fresh for live store launch"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Clear Test Data</span>
            </button>
          )}

          <button
            onClick={handleDownloadBackup}
            className="px-3 py-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="Download full JSON Database snapshot"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Backup</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-stone-900">
            ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <span>From {orders.length} orders total</span>
          </div>
        </div>

        {/* Metric 2: Printing & Processing Queue */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Printing Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-stone-900">
            {activePrintingCount}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {activePrintingCount > 0 ? `${activePrintingCount} jobs in production` : 'Queue all clear'}
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div
          onClick={() => setActiveTab('products')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Catalog Items</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-stone-900">
            {products.length}
          </div>
          <div className="text-[11px] text-stone-500 font-semibold mt-1">
            {inStockProductsCount} In Stock · Real Live Catalog
          </div>
        </div>

        {/* Metric 4: Customer Leads */}
        <div
          onClick={() => setActiveTab('inquiries')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Customer Leads</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-stone-900">
            {inquiries.length}
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">
            {newInquiriesCount > 0 ? `${newInquiriesCount} new awaiting reply` : 'All leads answered'}
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Printing Orders & Recent Customer Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Orders & Fast Status Action */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <div>
              <h3 className="font-display font-black text-base text-stone-900 uppercase">
                Live Orders & Production Queue
              </h3>
              <p className="text-xs text-stone-500">
                Manage order state, print progress, and customer delivery tracking
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-stone-50/70 border border-dashed border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-stone-900 text-sm sm:text-base">
                Your Store is Clean & Live Ready!
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
                There are currently no mock orders. When real customers order custom t-shirts, mugs, or photo frames from your website, their orders will show up here instantly.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Storefront</span>
                </button>
                <button
                  onClick={loadDemoData}
                  className="px-3.5 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Load Sample Orders</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.orderId}
                  className="p-3.5 sm:p-4 rounded-2xl border border-stone-200 hover:border-stone-300 bg-stone-50/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        #{order.orderId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Printing'
                            ? 'bg-amber-100 text-amber-800'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="text-stone-700 font-semibold">
                      {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                    </div>

                    <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-2">
                      <span>
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item(s) (
                        {order.items.map((i) => i.productName).join(', ')})
                      </span>
                      <span>·</span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹{order.totalAmount.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Status Switcher & WhatsApp Button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <a
                      href={`https://wa.me/${order.shippingAddress.phone.replace(
                        /\D/g,
                        ''
                      )}?text=Hello%20${encodeURIComponent(
                        order.shippingAddress.fullName
                      )}%2C%20Pro.%20Shaikh%20Sameer%20from%20JR%20Printing%20Works%20regarding%20your%20Order%20%23${
                        order.orderId
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-2xs"
                      title="Direct WhatsApp Chat with Customer"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                    </a>

                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order.orderId, e.target.value as OrderStatus)
                      }
                      className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 outline-none focus:border-stone-900"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Printing">Printing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Customer Inquiries & Contact Leads */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div>
                <h3 className="font-display font-black text-base text-stone-900 uppercase">
                  Customer Leads
                </h3>
                <p className="text-xs text-stone-500">Contact desk & quote requests</p>
              </div>
              <button
                onClick={() => setActiveTab('inquiries')}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
              >
                <span>View All ({inquiries.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="font-semibold text-stone-700">No leads recorded yet</p>
                <p className="text-[11px] mt-0.5">
                  When visitors submit inquiries or WhatsApp requests, they will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{inq.customerName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'New'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-800 font-semibold font-mono">
                      {inq.phone}
                    </div>
                    <p className="text-stone-600 text-[11px] line-clamp-2 leading-relaxed">
                      "{inq.message}"
                    </p>

                    <a
                      href={`https://wa.me/${inq.phone.replace(
                        /\D/g,
                        ''
                      )}?text=Hello%20${encodeURIComponent(
                        inq.customerName
                      )}%2C%20Pro.%20Shaikh%20Sameer%20from%20JR%20Printing%20Works%20replying%20to%20your%20inquiry.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Direct WhatsApp Helpline</span>
            <span className="font-mono font-bold text-stone-800">
              {JR_INFO.phone1}
            </span>
          </div>
        </div>
      </div>

      {/* Clear Demo Data Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-lg text-stone-900">
                Clear Test / Demo Data?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                This will remove all sample dummy orders and mock inquiries so your store is 100% clean for your live customers. Real products in your catalog will be preserved.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllDemoData();
                  setShowClearConfirmModal(false);
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
              >
                Yes, Clear for Live Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
