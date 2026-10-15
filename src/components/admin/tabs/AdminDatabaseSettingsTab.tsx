import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { JR_INFO } from '../../../data/products';
import {
  Database,
  Download,
  Upload,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Server,
  Code,
  Copy,
  AlertTriangle,
  Lock,
  Wifi,
  RefreshCw,
  Phone,
  CreditCard,
  Trash2,
  Check,
  ExternalLink,
} from 'lucide-react';

export const AdminDatabaseSettingsTab: React.FC = () => {
  const {
    products,
    orders,
    inquiries,
    exportDatabaseJson,
    exportDatabaseSql,
    importDatabaseJson,
    resetDatabaseToDefaults,
    clearAllDemoData,
    adminPin,
    updateAdminPin,
    databaseConfig,
    updateDatabaseConfig,
    testDatabaseConnection,
    syncDatabaseNow,
    storeSettings,
    updateStoreSettings,
    addToast,
  } = useApp();

  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Store Settings Form State
  const [storeUpi, setStoreUpi] = useState(storeSettings.upiId);
  const [storePhone1, setStorePhone1] = useState(storeSettings.phone1);
  const [storePhone2, setStorePhone2] = useState(storeSettings.phone2);
  const [storeFreeShipping, setStoreFreeShipping] = useState(storeSettings.freeShippingThreshold);

  // Database Connection Inputs
  const [dbProvider, setDbProvider] = useState(databaseConfig.provider);
  const [dbEndpoint, setDbEndpoint] = useState(databaseConfig.endpointUrl);
  const [dbApiKey, setDbApiKey] = useState(databaseConfig.apiKey);
  const [dbProjectId, setDbProjectId] = useState(databaseConfig.projectId);

  const handleExportJson = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jr_printing_db_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Complete database records exported as JSON file!', 'success');
  };

  const handleExportSql = () => {
    const sqlStr = exportDatabaseSql();
    const blob = new Blob([sqlStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jr_printing_postgres_dump_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('PostgreSQL SQL DDL & Data Dump downloaded successfully!', 'success');
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) {
      addToast('Please paste a valid database JSON string', 'error');
      return;
    }
    const success = importDatabaseJson(importJsonText.trim());
    if (success) {
      setImportJsonText('');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput !== confirmPinInput) {
      addToast('New PIN and Confirm PIN do not match', 'error');
      return;
    }
    const success = updateAdminPin(currentPinInput, newPinInput);
    if (success) {
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    }
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      upiId: storeUpi.trim(),
      phone1: storePhone1.trim(),
      phone2: storePhone2.trim(),
      freeShippingThreshold: Number(storeFreeShipping) || 999,
    });
    addToast('Store payment & helpline settings updated!', 'success');
  };

  const handleSaveDatabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateDatabaseConfig({
      provider: dbProvider,
      endpointUrl: dbEndpoint.trim(),
      apiKey: dbApiKey.trim(),
      projectId: dbProjectId.trim(),
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionMessage(null);
    try {
      // Update config first
      updateDatabaseConfig({
        provider: dbProvider,
        endpointUrl: dbEndpoint.trim(),
        apiKey: dbApiKey.trim(),
        projectId: dbProjectId.trim(),
      });
      const res = await testDatabaseConnection();
      setConnectionMessage(res.message);
      if (res.success) {
        addToast(res.message, 'success');
      } else {
        addToast(res.message, 'error');
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await syncDatabaseNow();
    } finally {
      setIsSyncing(false);
    }
  };

  const sqlSamplePreview = `-- JR PRINTING WORKS PostgreSQL Schema
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  images TEXT[]
);

CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(64) PRIMARY KEY,
  created_at BIGINT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  order_status VARCHAR(32) DEFAULT 'Processing',
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'New'
);`;

  const handleCopySql = () => {
    navigator.clipboard?.writeText(sqlSamplePreview);
    setCopiedSchema(true);
    addToast('PostgreSQL SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-display font-black text-stone-900 uppercase">
          Database Connection & Live Store Settings
        </h2>
        <p className="text-xs text-stone-500">
          Configure real database instance (PostgreSQL / Supabase / Firebase), export backups, manage UPI payment QR, and security PIN
        </p>
      </div>

      {/* Database Status Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>Production Store Database</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {databaseConfig.provider === 'local' ? 'Local Persistent Storage' : `${databaseConfig.provider.toUpperCase()} Ready`}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {products.length} Products · {orders.length} Orders · {inquiries.length} Leads · Last Synced: {new Date(databaseConfig.lastSyncedAt || Date.now()).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleExportSql}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Export SQL</span>
            </button>
          </div>
        </div>

        {/* 3 Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="text-stone-500 text-[11px] font-semibold">Products Catalog</div>
            <div className="font-black text-stone-900 text-lg font-mono">
              {products.length} active items
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="text-stone-500 text-[11px] font-semibold">Orders Queue</div>
            <div className="font-black text-stone-900 text-lg font-mono">
              {orders.length} orders recorded
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="text-stone-500 text-[11px] font-semibold">Customer Leads</div>
            <div className="font-black text-stone-900 text-lg font-mono">
              {inquiries.length} leads saved
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: External Database Connector & Live Store Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Live Database Connector (PostgreSQL / Supabase / Firebase / REST) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-700" />
              <h3 className="font-display font-black text-sm text-stone-900">
                Connect Live Database
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Live Backend Ready
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            When you're ready to connect an external production database (Cloud SQL, Supabase, Firebase, or PostgreSQL), select your provider and enter connection parameters. The app models sync directly.
          </p>

          <form onSubmit={handleSaveDatabaseConfig} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Database Engine / Provider
              </label>
              <select
                value={dbProvider}
                onChange={(e) => setDbProvider(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-semibold"
              >
                <option value="local">Local Persistent Storage (Browser Cache & Storage)</option>
                <option value="postgresql">PostgreSQL (Cloud SQL / Neon / Self-Hosted)</option>
                <option value="supabase">Supabase (PostgreSQL with Realtime)</option>
                <option value="firestore">Firebase Firestore (Google Cloud)</option>
                <option value="rest_api">Custom REST API / Webhook Endpoint</option>
              </select>
            </div>

            {dbProvider !== 'local' && (
              <>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Connection String / Host URL / Endpoint *
                  </label>
                  <input
                    type="text"
                    value={dbEndpoint}
                    onChange={(e) => setDbEndpoint(e.target.value)}
                    placeholder={
                      dbProvider === 'postgresql'
                        ? 'postgres://user:password@host:5432/jr_printing'
                        : dbProvider === 'supabase'
                        ? 'https://your-project.supabase.co'
                        : 'https://api.yourdomain.com/v1/sync'
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      API Key / Secret Token
                    </label>
                    <input
                      type="password"
                      value={dbApiKey}
                      onChange={(e) => setDbApiKey(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Project ID
                    </label>
                    <input
                      type="text"
                      value={dbProjectId}
                      onChange={(e) => setDbProjectId(e.target.value)}
                      placeholder="jr-printing-works"
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Wifi className={`w-3.5 h-3.5 text-amber-400 ${isTestingConnection ? 'animate-pulse' : ''}`} />
                <span>{isTestingConnection ? 'Testing Connection...' : 'Test Connection'}</span>
              </button>

              <button
                type="submit"
                className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-bold transition-colors"
              >
                Save Config
              </button>
            </div>

            {connectionMessage && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{connectionMessage}</span>
              </div>
            )}
          </form>

          {/* SQL Schema Preview */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">Database SQL DDL Schema</span>
              <button
                onClick={handleCopySql}
                className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedSchema ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <div className="bg-stone-900 text-stone-200 p-3 rounded-2xl font-mono text-[10px] overflow-x-auto max-h-36 border border-stone-800">
              <pre>{sqlSamplePreview}</pre>
            </div>
          </div>
        </div>

        {/* Right Column: Live Store Settings & Admin Security PIN */}
        <div className="space-y-6">
          {/* Store Payment & Helpline Configuration */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <h3 className="font-display font-black text-sm text-stone-900">
                Live Store Payment & Helpline
              </h3>
            </div>

            <form onSubmit={handleSaveStoreSettings} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Primary UPI ID for GPay / PhonePe / QR Code *
                </label>
                <input
                  type="text"
                  required
                  value={storeUpi}
                  onChange={(e) => setStoreUpi(e.target.value)}
                  placeholder="e.g. 7888162822@upi or 7888162824@ybl"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono font-bold text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    WhatsApp Helpline 1
                  </label>
                  <input
                    type="text"
                    required
                    value={storePhone1}
                    onChange={(e) => setStorePhone1(e.target.value)}
                    placeholder="+91 7888162822"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Shaikh Sameer Direct Phone 2
                  </label>
                  <input
                    type="text"
                    required
                    value={storePhone2}
                    onChange={(e) => setStorePhone2(e.target.value)}
                    placeholder="+91 7888162824"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Free Shipping Minimum Threshold (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={storeFreeShipping}
                  onChange={(e) => setStoreFreeShipping(Number(e.target.value))}
                  placeholder="999"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Save Payment & Store Info
              </button>
            </form>
          </div>

          {/* Security PIN Change Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Lock className="w-4 h-4 text-amber-700" />
              <h3 className="font-display font-black text-sm text-stone-900">
                Admin Security PIN (Current Default: 7888)
              </h3>
            </div>

            <form onSubmit={handleChangePin} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Current Security PIN
                </label>
                <input
                  type="password"
                  required
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="Enter current PIN"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    New PIN (min 4 digits)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="New PIN"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="Confirm PIN"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Update Admin PIN
              </button>
            </form>
          </div>

          {/* Clean Store / Reset Options */}
          <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200 space-y-3 text-xs">
            <h4 className="font-bold text-stone-900">Live Launch & Data Utilities</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(true)}
                className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-stone-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Test Orders (Go Live)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowResetConfirmModal(true)}
                className="flex-1 py-2 px-3 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Demo Confirmation Modal (In-App) */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-base text-stone-900">
                Clear Test Data for Live Store?
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                This removes all sample orders and dummy leads. Real products in your shop catalog remain intact. Your store will be 100% clean for live production customers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllDemoData();
                  setShowClearConfirmModal(false);
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs"
              >
                Yes, Clear Test Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal (In-App) */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-base text-stone-900">
                Reset to Default Catalog?
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                This will reload the official JR PRINTING WORKS default product catalog and initial sample data.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDatabaseToDefaults();
                  setShowResetConfirmModal(false);
                }}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs"
              >
                Reset Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
