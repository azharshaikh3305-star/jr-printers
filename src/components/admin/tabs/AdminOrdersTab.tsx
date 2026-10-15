import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Order, OrderStatus } from '../../../types';
import {
  Search,
  Filter,
  MessageSquare,
  Truck,
  Printer,
  Calendar,
  CreditCard,
  MapPin,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronDown,
  X,
  FileText,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const AdminOrdersTab: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    createManualOrder,
    clearAllDemoData,
    loadDemoData,
    products,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [isAddManualOrderOpen, setIsAddManualOrderOpen] = useState(false);

  // Manual Order Form State
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualCity, setManualCity] = useState('Pune');
  const [manualStreet, setManualStreet] = useState('');
  const [manualProductId, setManualProductId] = useState(products[0]?.id || '');
  const [manualQty, setManualQty] = useState(1);
  const [manualCustomPrice, setManualCustomPrice] = useState<number>(products[0]?.basePrice || 499);
  const [manualPaymentMethod, setManualPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [manualPaymentStatus, setManualPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [manualNotes, setManualNotes] = useState('Direct Walk-in / Phone Order');

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = order.orderId.toLowerCase().includes(query);
        const matchName = order.shippingAddress.fullName.toLowerCase().includes(query);
        const matchPhone = order.shippingAddress.phone.includes(query);
        const matchCity = order.shippingAddress.city.toLowerCase().includes(query);
        const matchTracking = (order.trackingNumber || '').toLowerCase().includes(query);
        if (!matchId && !matchName && !matchPhone && !matchCity && !matchTracking) return false;
      }

      if (statusFilter !== 'All' && order.orderStatus !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleSaveTracking = (orderId: string, currentStatus: OrderStatus) => {
    const tracking = trackingInputs[orderId];
    if (!tracking || !tracking.trim()) {
      addToast('Please enter a tracking number', 'error');
      return;
    }
    updateOrderStatus(orderId, currentStatus, tracking.trim());
    addToast(`Tracking number for #${orderId} saved`, 'success');
  };

  const handleManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualPhone.trim()) {
      addToast('Please enter customer name and phone number', 'error');
      return;
    }

    const selectedProd = products.find((p) => p.id === manualProductId) || products[0];
    const unitPrice = Number(manualCustomPrice) || selectedProd?.basePrice || 499;
    const subtotal = unitPrice * manualQty;

    const newOrder: Order = {
      orderId: `JR-MAN-${Date.now().toString().slice(-4)}`,
      createdAt: Date.now(),
      items: [
        {
          id: `item-${Date.now()}`,
          productId: selectedProd.id,
          productName: selectedProd.name,
          garmentType: selectedProd.garmentType,
          colorName: 'Standard Studio',
          colorHex: '#18181b',
          size: selectedProd.sizes?.[0] || 'Standard',
          quantity: manualQty,
          unitPrice: unitPrice,
          totalPrice: subtotal,
          printLocations: [manualNotes || 'Custom Print Job'],
        },
      ],
      shippingAddress: {
        fullName: manualCustomerName.trim(),
        email: manualEmail.trim() || `${manualPhone.replace(/\D/g, '')}@customer.jrprinting.in`,
        phone: manualPhone.startsWith('+91') ? manualPhone.trim() : `+91 ${manualPhone.trim()}`,
        street: manualStreet.trim() || 'Direct Studio Pickup',
        city: manualCity.trim() || 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
      },
      shippingMethod: 'standard',
      shippingCost: 0,
      taxAmount: 0,
      subtotal: subtotal,
      discountAmount: 0,
      totalAmount: subtotal,
      paymentMethod: manualPaymentMethod,
      paymentStatus: manualPaymentStatus,
      orderStatus: 'Printing',
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      trackingNumber: 'Studio Direct Dispatch',
    };

    createManualOrder(newOrder);
    setIsAddManualOrderOpen(false);

    // Reset manual form
    setManualCustomerName('');
    setManualPhone('');
    setManualEmail('');
    setManualStreet('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display font-black text-stone-900 uppercase">
              Orders & Production Queue
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real customer orders and custom print requests recorded in your system
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, name, phone..."
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
            onClick={() => setIsAddManualOrderOpen(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Offline Order</span>
          </button>
        </div>
      </div>

      {/* Status Filter Badges (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
        {(['All', 'Processing', 'Printing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
          (status) => {
            const count =
              status === 'All'
                ? orders.length
                : orders.filter((o) => o.orderStatus === status).length;
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
          }
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200 space-y-3">
          <Truck className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="font-display font-bold text-stone-800 text-base">
            {orders.length === 0 ? 'No Orders Recorded (Clean Live State)' : 'No Matching Orders'}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            {orders.length === 0
              ? 'Your store is ready for live orders. Any order submitted by customers in the shop or customized in the studio canvas will appear here automatically.'
              : 'Try changing your search query or status filter.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setIsAddManualOrderOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Walk-in / Phone Order</span>
            </button>
            {orders.length === 0 && (
              <button
                onClick={loadDemoData}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Sample Orders</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.orderId}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:border-stone-300 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-stone-900 text-sm sm:text-base">
                      #{order.orderId}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">·</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Pill */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : order.orderStatus === 'Printing'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-stone-100 text-stone-800 border border-stone-300'
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    {/* Payment Status Pill */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* Middle Section: Customer Details & Ordered Items */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left Column: Customer & Shipping Details */}
                  <div className="lg:col-span-5 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                    <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-stone-400 mb-1">
                      Customer & Delivery Address
                    </div>
                    <div className="font-bold text-stone-900 text-sm">
                      {order.shippingAddress.fullName}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-stone-800 font-semibold">
                        {order.shippingAddress.phone}
                      </span>
                      {/* 1-Click WhatsApp Button */}
                      <a
                        href={`https://wa.me/${order.shippingAddress.phone.replace(
                          /\D/g,
                          ''
                        )}?text=Hello%20${encodeURIComponent(
                          order.shippingAddress.fullName
                        )}%2C%20Pro.%20Shaikh%20Sameer%20from%20JR%20Printing%20Works%20regarding%20Order%20%23${
                          order.orderId
                        }.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 fill-white" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="text-stone-500">{order.shippingAddress.email}</div>

                    <div className="pt-2 border-t border-stone-200/60 flex items-start gap-1.5 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress.street}
                        {order.shippingAddress.apartment
                          ? `, ${order.shippingAddress.apartment}`
                          : ''}
                        , {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                        {order.shippingAddress.postalCode}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Ordered Items List */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="font-bold text-stone-400 uppercase tracking-wider text-[11px]">
                      Items Ordered ({order.items.length})
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-stone-200 border border-stone-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-stone-400">
                              {item.designThumbnail ? (
                                <img
                                  src={item.designThumbnail}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Printer className="w-5 h-5 text-stone-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900">{item.productName}</div>
                              <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span>Size: {item.size}</span>
                                <span>·</span>
                                <span>Color: {item.colorName}</span>
                                <span>·</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                              {item.printLocations && item.printLocations.length > 0 && (
                                <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
                                  Print: {item.printLocations.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right font-mono font-bold text-stone-900 shrink-0">
                            ₹{item.totalPrice}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Financial Total Strip */}
                    <div className="pt-2 flex items-center justify-between text-xs text-stone-600 font-semibold">
                      <span>Subtotal: ₹{order.subtotal} + Tax ₹{order.taxAmount.toFixed(0)}</span>
                      <span className="font-mono font-black text-stone-900 text-sm">
                        Total: ₹{order.totalAmount.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Order Management Bar (Status Switcher & Tracking) */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-600">Update Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order.orderId, e.target.value as OrderStatus)
                      }
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 outline-none focus:border-stone-900 transition-colors"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Printing">Printing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Tracking Number Input & Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BLUEDART-99210"
                      defaultValue={order.trackingNumber || ''}
                      onChange={(e) =>
                        setTrackingInputs((prev) => ({
                          ...prev,
                          [order.orderId]: e.target.value,
                        }))
                      }
                      className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-900 w-36 sm:w-44 outline-none focus:border-stone-900"
                    />
                    <button
                      onClick={() => handleSaveTracking(order.orderId, order.orderStatus)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Save Track#
                    </button>
                    <button
                      onClick={() => setSelectedOrderForInvoice(order)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                      title="View Print Invoice / Receipt"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setOrderToDelete(order)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="Delete Order"
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
      {orderToDelete && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-base text-stone-900">
                Delete Order #{orderToDelete.orderId}?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Customer: <strong>{orderToDelete.shippingAddress.fullName}</strong>. This record will be permanently removed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOrder(orderToDelete.orderId);
                  setOrderToDelete(null);
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Manual / Walk-in Order Modal */}
      {isAddManualOrderOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-display font-black text-base text-stone-900 uppercase">
                  Record Offline / Walk-in Order
                </h3>
                <p className="text-xs text-stone-500">
                  Create direct print job for customers who visited workshop or called on phone
                </p>
              </div>
              <button
                onClick={() => setIsAddManualOrderOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualOrderSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={manualCustomerName}
                    onChange={(e) => setManualCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="e.g. 9822012345"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Product / Service</label>
                <select
                  value={manualProductId}
                  onChange={(e) => {
                    setManualProductId(e.target.value);
                    const p = products.find((prod) => prod.id === e.target.value);
                    if (p) setManualCustomPrice(p.basePrice);
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-semibold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Base: ₹{p.basePrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={manualQty}
                    onChange={(e) => setManualQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={manualCustomPrice}
                    onChange={(e) => setManualCustomPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Payment Method</label>
                  <select
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none"
                  >
                    <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe)</option>
                    <option value="Cash at Studio">Cash at Studio</option>
                    <option value="Bank Transfer">Bank Transfer / IMPS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Payment Status</label>
                  <select
                    value={manualPaymentStatus}
                    onChange={(e) => setManualPaymentStatus(e.target.value as 'Paid' | 'Pending')}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-bold"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Delivery / Pickup Address</label>
                <input
                  type="text"
                  value={manualStreet}
                  onChange={(e) => setManualStreet(e.target.value)}
                  placeholder="Studio Counter Pickup or address in Pune"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Custom Artwork / Print Details</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Front chest photo with golden foil name"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-black border-t border-stone-100">
                <span>Calculated Total:</span>
                <span className="font-mono text-base text-stone-900">
                  ₹{(manualCustomPrice * manualQty).toFixed(0)}
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddManualOrderOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-bold shadow-md transition-colors"
                >
                  Save & Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 font-black flex items-center justify-center font-display text-sm">
                  JR
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-stone-900">
                    JR PRINTING WORKS
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Pro. Shaikh Sameer · WhatsApp: 7888162822
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-mono font-bold">#{selectedOrderForInvoice.orderId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Customer:</span>
                <span className="font-bold">
                  {selectedOrderForInvoice.shippingAddress.fullName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Phone:</span>
                <span className="font-mono">
                  {selectedOrderForInvoice.shippingAddress.phone}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Address:</span>
                <span className="text-right max-w-xs text-stone-700">
                  {selectedOrderForInvoice.shippingAddress.street},{' '}
                  {selectedOrderForInvoice.shippingAddress.city} -{' '}
                  {selectedOrderForInvoice.shippingAddress.postalCode}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Payment:</span>
                <span className="font-bold text-emerald-700">
                  {selectedOrderForInvoice.paymentStatus} via{' '}
                  {selectedOrderForInvoice.paymentMethod}
                </span>
              </div>

              <div className="pt-2 space-y-1.5">
                <div className="font-bold text-stone-700">Ordered Print Items:</div>
                {selectedOrderForInvoice.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-stone-600 bg-stone-50 p-2 rounded-xl">
                    <div>
                      <div className="font-bold text-stone-900">{i.productName}</div>
                      <div className="text-[10px] text-stone-500">
                        Qty: {i.quantity} · Size: {i.size} · Color: {i.colorName}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900">₹{i.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t-2 border-stone-900 flex justify-between font-black text-sm text-stone-900">
                <span>Grand Total:</span>
                <span className="font-mono text-base">
                  ₹{selectedOrderForInvoice.totalAmount.toFixed(0)}
                </span>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <a
                href={`https://wa.me/${selectedOrderForInvoice.shippingAddress.phone.replace(
                  /\D/g,
                  ''
                )}?text=Invoice%20Receipt%20for%20Order%20%23${
                  selectedOrderForInvoice.orderId
                }%20at%20JR%20Printing%20Works.%20Total:%20INR%20${
                  selectedOrderForInvoice.totalAmount
                }.%20Status:%20${selectedOrderForInvoice.orderStatus}.%20Thank%20you!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Send WhatsApp Receipt</span>
              </a>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2.5 bg-stone-100 text-stone-800 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
