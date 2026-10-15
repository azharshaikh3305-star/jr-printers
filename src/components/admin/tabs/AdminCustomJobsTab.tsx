import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Palette, Eye, ArrowRight, Calendar, MessageSquare, Printer, CheckCircle } from 'lucide-react';
import { JR_INFO } from '../../../data/products';

export const AdminCustomJobsTab: React.FC = () => {
  const { savedDesigns, orders, loadDesignIntoStudio, navigateTo, addToast } = useApp();

  // Extract all custom designs from savedDesigns and order items
  const customOrderItems = orders
    .flatMap((o) =>
      o.items
        .filter((item) => item.customDesign || item.printLocations?.length > 0)
        .map((item) => ({
          orderId: o.orderId,
          customerName: o.shippingAddress.fullName,
          phone: o.shippingAddress.phone,
          item,
          createdAt: o.createdAt,
        }))
    );

  const handleOpenStudio = (design: any) => {
    loadDesignIntoStudio(design);
    navigateTo('designer');
    addToast('Customer design loaded into Custom Studio Canvas for inspection & print output', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-display font-black text-stone-900 uppercase">
          Custom Studio Submissions & Print Proofs
        </h2>
        <p className="text-xs text-stone-500">
          Inspect custom graphic placements, uploaded customer photos, and vector canvas objects
        </p>
      </div>

      {/* Saved / Customer Studio Proofs Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-sm text-stone-800 flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-600" />
          <span>Active Custom Studio Artwork ({savedDesigns.length + customOrderItems.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Custom Designs from Orders */}
          {customOrderItems.map((job, idx) => (
            <div
              key={`job-${idx}`}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <span className="font-mono font-bold text-stone-900 text-xs">
                    Order #{job.orderId}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    Live Order Proof
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {job.item.designThumbnail ? (
                      <img
                        src={job.item.designThumbnail}
                        alt="Design proof"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Printer className="w-6 h-6 text-stone-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs line-clamp-1">
                      {job.item.productName}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Customer: <strong className="text-stone-800">{job.customerName}</strong>
                    </p>
                    <p className="text-[10px] font-mono text-stone-500">{job.phone}</p>
                  </div>
                </div>

                {job.item.printLocations && (
                  <div className="text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-200 text-stone-700">
                    <span className="font-bold text-amber-900">Requested Placements: </span>
                    {job.item.printLocations.join(', ')}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                <a
                  href={`https://wa.me/${job.phone.replace(
                    /\D/g,
                    ''
                  )}?text=Hello%20${encodeURIComponent(
                    job.customerName
                  )}%2C%20Shaikh%20Sameer%20from%20JR%20Printing%20Works.%20Sending%20your%20print%20mockup%20for%20Order%20%23${
                    job.orderId
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Proof</span>
                </a>
              </div>
            </div>
          ))}

          {/* Saved Studio Designs */}
          {savedDesigns.map((design) => {
            const frontCount = design.views?.front?.objects?.length || 0;
            const backCount = design.views?.back?.objects?.length || 0;

            return (
              <div
                key={design.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                    <span className="font-display font-black text-stone-900 text-xs">
                      {design.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                      Studio Canvas
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Base Apparel:</span>
                      <span className="font-semibold text-stone-900">{design.garmentId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fabric Color:</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: design.shirtColor }}
                        />
                        <span className="font-semibold text-stone-900">
                          {design.shirtColorName}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Canvas Elements:</span>
                      <span className="font-semibold text-stone-900">
                        {frontCount} Front · {backCount} Back
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Print Price:</span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹{design.calculatedPrice || 999}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleOpenStudio(design)}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open in Studio Canvas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
