import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Package,
  Upload,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { GARMENT_OPTIONS, JR_INFO } from '../../data/products';

export const ContactPage: React.FC = () => {
  const { addToast, navigateTo, orders } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'custom-print',
    garmentType: 't-shirt',
    quantityRange: '1',
    message: '',
    hasArtwork: false,
    fileName: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Quick Order Tracking on Contact Page
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackResult, setTrackResult] = useState<{
    found: boolean;
    orderId?: string;
    status?: string;
    itemsCount?: number;
    delivery?: string;
    trackingNum?: string;
  } | null>(null);

  const handleCopyPhone = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedPhone(num);
    addToast(`${num} copied to clipboard`, 'info');
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        hasArtwork: true,
        fileName: file.name,
      }));
      addToast(`Artwork attached: ${file.name}`, 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill in your name, email, and message', 'error');
      return;
    }

    const generatedTicket = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketId(generatedTicket);
    setSubmitted(true);
    addToast(`Inquiry #${generatedTicket} lodged! Our apparel specialists will respond within 2 hours.`, 'success');
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderId.trim()) return;

    const trimmed = trackOrderId.trim().toUpperCase();
    const foundOrder = orders.find(
      (o) =>
        o.orderId.toUpperCase() === trimmed ||
        o.orderId.replace('ATL-', '').toUpperCase() === trimmed ||
        o.trackingNumber.toUpperCase().includes(trimmed)
    );

    if (foundOrder) {
      setTrackResult({
        found: true,
        orderId: foundOrder.orderId,
        status: foundOrder.orderStatus,
        itemsCount: foundOrder.items.reduce((s, i) => s + i.quantity, 0),
        delivery: foundOrder.estimatedDeliveryDate,
        trackingNum: foundOrder.trackingNumber,
      });
    } else {
      setTrackResult({
        found: false,
      });
    }
  };

  const faqs = [
    {
      q: 'What is your minimum order quantity (MOQ)?',
      a: 'We have absolutely zero minimum order requirements! You can customize and order a single signature T-shirt or hoodie. For startups, colleges, or corporate teams ordering 10+, 50+, or 100+ pieces, automated volume discounts of up to 35% are calculated automatically at checkout.',
    },
    {
      q: 'What image format is best for high-definition 1200 DPI printing?',
      a: 'We strongly recommend transparent PNG or vector SVG files at 300 DPI. Our integrated Custom Studio automatically assesses resolution quality and flags low-DPI graphics in real time so your physical print turns out crisp and sharp.',
    },
    {
      q: 'How long does production take before my order ships across India?',
      a: 'Custom printed garments are pre-flight proofed, printed with archival water-based inks, and heat-cured within 24 to 48 business hours. Standard insured ground delivery arrives in 3–5 days across all metro and Tier-1/2 cities, and 2-Day Air is available at checkout.',
    },
    {
      q: 'Can I print on the back and sleeves as well as the front?',
      a: 'Yes! Our custom designer gives you separate canvases for Front, Back, Left Sleeve, and Right Sleeve. The live price updates dynamically as you add print zones.',
    },
    {
      q: 'Do you provide GST invoices for corporate orders and brand collabs?',
      a: 'Yes. All orders include official B2B tax invoices with 18% GST input tax credit capability. You can enter your company legal name and GSTIN during checkout or contact our B2B desk for bulk quotation slips.',
    },
    {
      q: 'What is the Atelier Print Perfection Guarantee?',
      a: 'If there is ever a textile flaw, misprint, or print discrepancy against your approved digital preview, we will reprint and dispatch a replacement completely free of charge—no hassle.',
    },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>JR PRINTING WORKS · Pro. Shaikh Sameer</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-stone-900 tracking-tight">
            Contact JR PRINTING WORKS
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Direct customer desk for T-Shirt Printing, Cup Printing, Pillow Printing, Bottle Printing, Key Chain Printing, Photo Frame Printing, and Mobile Back Covers. Connect on WhatsApp or lodge an inquiry below.
          </p>
        </div>

        {/* 4 Quick Contact Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Card 1: WhatsApp 1 */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">WhatsApp Helpline 1</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Send photos for mugs, pillows, frames, and tees.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <a
                href={JR_INFO.whatsapp1Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>+91 {JR_INFO.phone1}</span>
                <ExternalLink className="w-3 h-3 text-emerald-600" />
              </a>
              <button
                onClick={() => handleCopyPhone(JR_INFO.phone1)}
                className="text-stone-400 hover:text-stone-700 p-1"
                title="Copy phone number"
              >
                {copiedPhone === JR_INFO.phone1 ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 2: Pro. Shaikh Sameer */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-amber-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">Pro. Shaikh Sameer</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Direct proprietor helpline for bulk quotes and custom designs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <a
                href={JR_INFO.whatsapp2Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>+91 {JR_INFO.phone2}</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
              <button
                onClick={() => handleCopyPhone(JR_INFO.phone2)}
                className="text-stone-400 hover:text-stone-700 p-1"
                title="Copy phone number"
              >
                {copiedPhone === JR_INFO.phone2 ? <Check className="w-4 h-4 text-amber-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 3: Printing Services */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">Printing Services</h4>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                T-Shirt, Cup, Pillow, Bottle, Key Chain, Photo Frame & Mobile Covers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Same-day WhatsApp proofs
              </span>
            </div>
          </div>

          {/* Card 4: Studio Fulfillment */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center mb-3">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">Express Safe Delivery</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Insured thermocol protective packing with BlueDart tracking across India.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100">
              <span className="text-[11px] text-stone-600 font-semibold">Single piece & bulk orders welcome</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Form & Right Utilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <span className="inline-block bg-emerald-100 text-emerald-800 font-mono font-bold text-xs px-3 py-1 rounded-full">
                  Ticket #{ticketId}
                </span>
                <h3 className="font-display font-bold text-2xl text-stone-900">
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. A dedicated apparel print technician has received your
                  details and will review your inquiry. A confirmation receipt has been scheduled for{' '}
                  <span className="font-mono text-stone-900">{formData.email}</span>.
                </p>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto text-left text-xs space-y-1.5 text-stone-600 mt-4">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Subject:</span>
                    <span className="font-medium text-stone-800">{formData.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Target Garment:</span>
                    <span className="font-medium text-stone-800">{formData.garmentType}</span>
                  </div>
                  {formData.fileName && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Attachment:</span>
                      <span className="font-medium text-emerald-700 truncate max-w-[200px]">{formData.fileName}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-stone-200">
                    <span className="text-stone-400">Guaranteed Response SLA:</span>
                    <span className="font-bold text-emerald-700">Within 2 hours</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'custom-print',
                        garmentType: 'heavyweight-tee',
                        quantityRange: '1',
                        message: '',
                        hasArtwork: false,
                        fileName: '',
                      });
                    }}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                  <button
                    onClick={() => navigateTo('designer')}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>Launch Custom Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-stone-100 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-stone-900 font-display">
                    Send Studio Inquiry or Bulk Quote Request
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Our print master proofs all design files and replies with textile recommendations.
                  </p>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Phone & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Mobile Number (WhatsApp)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-200 bg-stone-100 text-stone-500 text-xs font-mono">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="98765 43210"
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-r-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      <option value="custom-print">Custom Studio & Artwork Proofing</option>
                      <option value="bulk">Bulk / Corporate / College Festival Orders (GST Bill)</option>
                      <option value="order-status">Order Tracking & Shipping Status</option>
                      <option value="swatches">Fabric Swatch & Quality Sample Kit</option>
                      <option value="exchange">Sizing Exchange or Quality Guarantee</option>
                    </select>
                  </div>
                </div>

                {/* Garment Choice & Estimated Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Product / Item of Interest
                    </label>
                    <select
                      value={formData.garmentType}
                      onChange={(e) => setFormData({ ...formData, garmentType: e.target.value })}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      <option value="t-shirt">👕 T-Shirt Printing ("Add your Design HERE")</option>
                      <option value="ceramic-cup">☕ Ceramic Photo Collage Mug</option>
                      <option value="magic-cup">☕ Magic Heat-Sensitive Photo Reveal Mug</option>
                      <option value="velvet-pillow">🛋️ Luxury Velvet Photo Pillow / Cushion</option>
                      <option value="sequin-pillow">🛋️ Magic Reversible Sequin Swipe Pillow</option>
                      <option value="sipper-bottle">🍾 750ml Aluminum Sports Sipper Bottle</option>
                      <option value="photo-frame">🖼️ Wooden Wall Collage Photo Frame (Shivansh & Shanaya Style)</option>
                      <option value="keychain">🔑 Custom Acrylic & Metal Photo Key Chains</option>
                      <option value="mobile-cover">📱 Custom HD Mobile Back Cover Case</option>
                      <option value="hoodie">🧥 Heavyweight Studio Fleece Hoodie</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Quantity Needed
                    </label>
                    <select
                      value={formData.quantityRange}
                      onChange={(e) => setFormData({ ...formData, quantityRange: e.target.value })}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      <option value="1">1 piece (Custom Single Sample)</option>
                      <option value="2-10">2 – 10 pieces (Boutique run)</option>
                      <option value="11-50">11 – 50 pieces (Team / Club discount)</option>
                      <option value="51-200">51 – 200 pieces (Corporate / Festival 25% OFF)</option>
                      <option value="200+">200+ pieces (Full production 35% OFF)</option>
                    </select>
                  </div>
                </div>

                {/* Artwork File Upload Simulator */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Attach Design Artwork (Optional for Pre-Flight Evaluation)
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-stone-50 border border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-100 hover:border-stone-400 transition-colors">
                    <Upload className="w-4 h-4 text-stone-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-stone-700 truncate block">
                        {formData.fileName || 'Upload PNG, SVG, or PDF (Max 25MB)'}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        Our technicians check transparency, DPI, and print boundaries
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-white border border-stone-200 text-stone-800 rounded-lg text-[10px] font-bold">
                      Browse
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Inquiry Details & Printing Requirements <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your print locations (front, back, sleeves), desired delivery deadline, or fabric preferences..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Studio</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Instant Order Tracker + Studio Hub + FAQ */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Quick Track Order Widget */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Package className="w-5 h-5 text-amber-700" />
                <h3 className="font-display font-bold text-base">Quick Order Tracker</h3>
              </div>
              <p className="text-xs text-stone-500">
                Check production or shipping status instantly with your order or BlueDart number:
              </p>

              <form onSubmit={handleQuickTrack} className="flex gap-2">
                <input
                  type="text"
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  placeholder="e.g. ATL-84920"
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono outline-none focus:border-stone-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
                >
                  Track
                </button>
              </form>

              {trackResult && (
                <div className="pt-2 animate-in fade-in duration-200">
                  {trackResult.found ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">Order #{trackResult.orderId}</span>
                        <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {trackResult.status}
                        </span>
                      </div>
                      <p className="text-emerald-800 text-[11px]">
                        Items: {trackResult.itemsCount} · Est. Arrival: {trackResult.delivery}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-mono">
                        Courier: {trackResult.trackingNum}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                      No matching order found for "{trackOrderId}". Please verify the order number or check your{' '}
                      <button
                        onClick={() => navigateTo('account')}
                        className="font-bold underline"
                      >
                        Account History
                      </button>
                      .
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Studio Print Facility & Showroom Information */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-base text-stone-900 pb-2 border-b border-stone-100 flex items-center justify-between">
                <span>Studio Headquarters</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Open Today
                </span>
              </h3>

              <div className="space-y-3.5 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-stone-900">Atelier Studio & Print Hub</h5>
                    <p>402 Prestige Technology Park, 100ft Road</p>
                    <p>Indiranagar, Bengaluru, Karnataka 560038, India</p>
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Near Indiranagar Metro Station (Exit Gate 2)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-stone-900">Operating Hours (IST)</h5>
                    <p>Monday – Saturday: 9:00 AM – 7:30 PM</p>
                    <p>Sunday: Dispatch & Courier Handover Only</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-stone-900">Corporate & GST Compliance</h5>
                    <p>GSTIN: 29AABCA1234F1Z8</p>
                    <p className="text-[11px] text-stone-500">Official B2B invoices generated for all corporate orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Frequently Asked Questions Accordion */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="font-display font-bold text-base text-stone-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-800" />
                <span>Frequently Clarified</span>
              </h3>

              <div className="space-y-1 divide-y divide-stone-100">
                {faqs.map((faq, i) => (
                  <div key={i} className="pt-2">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left py-1.5 flex items-center justify-between text-xs font-bold text-stone-800 hover:text-stone-950"
                    >
                      <span className="pr-2">{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${
                          openFaq === i ? 'rotate-180 text-stone-900' : ''
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <p className="text-xs text-stone-500 pb-2.5 pt-1 leading-relaxed animate-in fade-in duration-150">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
