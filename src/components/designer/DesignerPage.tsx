import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CompleteDesign,
  PrintView,
  DesignObject,
  GarmentType,
} from '../../types';
import { GARMENT_OPTIONS, SIZES } from '../../data/products';
import { DesignerCanvas } from './DesignerCanvas';
import { DesignerLeftSidebar } from './DesignerLeftSidebar';
import { DesignerRightSidebar } from './DesignerRightSidebar';
import { DesignerTopBar } from './DesignerTopBar';
import { DesignPreviewModal } from './DesignPreviewModal';
import { SizeGuideModal } from '../common/SizeGuideModal';
import {
  Shirt,
  Upload,
  Type,
  Smile,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronUp,
  X,
  Ruler,
} from 'lucide-react';

export const DesignerPage: React.FC = () => {
  const {
    activeDesign,
    setActiveDesign,
    saveDesign,
    addToCart,
    addToast,
    setIsCartDrawerOpen,
  } = useApp();

  const [activeView, setActiveView] = useState<PrintView>('front');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [smartGuidesEnabled, setSmartGuidesEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Selected size for adding to cart
  const [selectedSize, setSelectedSize] = useState('L');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Mobile Bottom Drawer State
  const [mobileDrawerTab, setMobileDrawerTab] = useState<'tools' | 'inspector' | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<CompleteDesign[]>([JSON.parse(JSON.stringify(activeDesign))]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Ref to track latest design without re-triggering effects
  const designRef = useRef(activeDesign);
  designRef.current = activeDesign;

  // Push new state to undo/redo history
  const pushHistory = useCallback((newDesign: CompleteDesign) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, JSON.parse(JSON.stringify(newDesign))];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const prevDesign = JSON.parse(JSON.stringify(history[prevIdx]));
      setActiveDesign(prevDesign);
      setHistoryIndex(prevIdx);
      setSelectedIds([]);
      addToast('Undo performed', 'info');
    }
  }, [historyIndex, history, setActiveDesign, addToast]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const nextDesign = JSON.parse(JSON.stringify(history[nextIdx]));
      setActiveDesign(nextDesign);
      setHistoryIndex(nextIdx);
      setSelectedIds([]);
      addToast('Redo performed', 'info');
    }
  }, [historyIndex, history, setActiveDesign, addToast]);

  // Update a single object on the active view
  const handleUpdateObject = useCallback((
    id: string,
    updates: Partial<DesignObject>,
    recordHistory: boolean = true
  ) => {
    setActiveDesign((prev) => {
      const curObjects = prev.views[activeView]?.objects || [];
      const updatedObjects = curObjects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      );

      const nextDesign: CompleteDesign = {
        ...prev,
        updatedAt: Date.now(),
        views: {
          ...prev.views,
          [activeView]: {
            ...prev.views[activeView],
            objects: updatedObjects,
          },
        },
      };

      if (recordHistory) {
        pushHistory(nextDesign);
      }
      return nextDesign;
    });
  }, [activeView, pushHistory, setActiveDesign]);

  // Add an object to the active view
  const handleAddObject = useCallback((newObj: Omit<DesignObject, 'id' | 'zIndex'>) => {
    const curObjects = designRef.current.views[activeView]?.objects || [];
    const maxZ = curObjects.reduce((max, o) => Math.max(max, o.zIndex), 0);

    const created: DesignObject = {
      ...newObj,
      id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      zIndex: maxZ + 1,
    };

    setActiveDesign((prev) => {
      const updated: CompleteDesign = {
        ...prev,
        updatedAt: Date.now(),
        views: {
          ...prev.views,
          [activeView]: {
            ...prev.views[activeView],
            objects: [...curObjects, created],
          },
        },
      };
      pushHistory(updated);
      return updated;
    });

    setSelectedIds([created.id]);
  }, [activeView, pushHistory, setActiveDesign]);

  // Delete objects
  const handleDeleteObjects = useCallback((idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;

    setActiveDesign((prev) => {
      const curObjects = prev.views[activeView]?.objects || [];
      const filtered = curObjects.filter((o) => !idsToDelete.includes(o.id));

      const updated: CompleteDesign = {
        ...prev,
        updatedAt: Date.now(),
        views: {
          ...prev.views,
          [activeView]: {
            ...prev.views[activeView],
            objects: filtered,
          },
        },
      };
      pushHistory(updated);
      return updated;
    });

    setSelectedIds([]);
    addToast('Object deleted', 'info');
  }, [activeView, pushHistory, setActiveDesign, addToast]);

  // Duplicate objects
  const handleDuplicateObjects = useCallback((idsToDup: string[]) => {
    const curObjects = designRef.current.views[activeView]?.objects || [];
    const targets = curObjects.filter((o) => idsToDup.includes(o.id));
    if (targets.length === 0) return;

    const maxZ = curObjects.reduce((max, o) => Math.max(max, o.zIndex), 0);
    const newItems: DesignObject[] = targets.map((t, idx) => ({
      ...JSON.parse(JSON.stringify(t)),
      id: `obj-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      x: t.x + 15,
      y: t.y + 15,
      zIndex: maxZ + 1 + idx,
      groupId: undefined, // Duplicates are independent initially
    }));

    setActiveDesign((prev) => {
      const updated: CompleteDesign = {
        ...prev,
        updatedAt: Date.now(),
        views: {
          ...prev.views,
          [activeView]: {
            ...prev.views[activeView],
            objects: [...curObjects, ...newItems],
          },
        },
      };
      pushHistory(updated);
      return updated;
    });

    setSelectedIds(newItems.map((item) => item.id));
    addToast(`Duplicated ${newItems.length} object(s)`, 'success');
  }, [activeView, pushHistory, setActiveDesign, addToast]);

  // Reorder object layers
  const handleReorderObject = useCallback((
    id: string,
    direction: 'up' | 'down' | 'top' | 'bottom'
  ) => {
    setActiveDesign((prev) => {
      const curObjects = [...(prev.views[activeView]?.objects || [])].sort(
        (a, b) => a.zIndex - b.zIndex
      );
      const idx = curObjects.findIndex((o) => o.id === id);
      if (idx === -1) return prev;

      if (direction === 'up' && idx < curObjects.length - 1) {
        const temp = curObjects[idx].zIndex;
        curObjects[idx].zIndex = curObjects[idx + 1].zIndex;
        curObjects[idx + 1].zIndex = temp;
      } else if (direction === 'down' && idx > 0) {
        const temp = curObjects[idx].zIndex;
        curObjects[idx].zIndex = curObjects[idx - 1].zIndex;
        curObjects[idx - 1].zIndex = temp;
      } else if (direction === 'top') {
        const maxZ = curObjects[curObjects.length - 1].zIndex;
        curObjects[idx].zIndex = maxZ + 1;
      } else if (direction === 'bottom') {
        const minZ = curObjects[0].zIndex;
        curObjects[idx].zIndex = Math.max(1, minZ - 1);
      }

      // Normalize z-indexes (1, 2, 3...)
      curObjects.sort((a, b) => a.zIndex - b.zIndex);
      curObjects.forEach((o, i) => (o.zIndex = i + 1));

      const updated: CompleteDesign = {
        ...prev,
        updatedAt: Date.now(),
        views: {
          ...prev.views,
          [activeView]: {
            ...prev.views[activeView],
            objects: curObjects,
          },
        },
      };
      pushHistory(updated);
      return updated;
    });
  }, [activeView, pushHistory, setActiveDesign]);

  // Group Objects
  const handleGroupObjects = useCallback((idsToGroup: string[]) => {
    if (idsToGroup.length < 2) return;
    const newGroupId = `group-${Date.now()}`;

    setActiveDesign((prev) => {
      const curObjects = prev.views[activeView]?.objects || [];
      const updated = curObjects.map((obj) =>
        idsToGroup.includes(obj.id) ? { ...obj, groupId: newGroupId } : obj
      );

      const nextDesign: CompleteDesign = {
        ...prev,
        updatedAt: Date.now(),
        views: {
          ...prev.views,
          [activeView]: {
            ...prev.views[activeView],
            objects: updated,
          },
        },
      };
      pushHistory(nextDesign);
      return nextDesign;
    });
    addToast('Objects grouped together', 'success');
  }, [activeView, pushHistory, setActiveDesign, addToast]);

  // Ungroup Objects
  const handleUngroupObjects = useCallback((idsToUngroup: string[]) => {
    setActiveDesign((prev) => {
      const curObjects = prev.views[activeView]?.objects || [];
      const updated = curObjects.map((obj) =>
        idsToUngroup.includes(obj.id) ? { ...obj, groupId: undefined } : obj
      );

      const nextDesign: CompleteDesign = {
        ...prev,
        updatedAt: Date.now(),
        views: {
          ...prev.views,
          [activeView]: {
            ...prev.views[activeView],
            objects: updated,
          },
        },
      };
      pushHistory(nextDesign);
      return nextDesign;
    });
    addToast('Group dissolved', 'info');
  }, [activeView, pushHistory, setActiveDesign, addToast]);

  // Update Garment Silhouette & Color
  const handleUpdateDesignGarment = (
    garmentId: GarmentType,
    colorHex: string,
    colorName: string
  ) => {
    setActiveDesign((prev) => {
      const updated: CompleteDesign = {
        ...prev,
        garmentId,
        shirtColor: colorHex,
        shirtColorName: colorName,
        updatedAt: Date.now(),
      };
      pushHistory(updated);
      return updated;
    });
    addToast(`Garment updated to ${colorName}`, 'info');
  };

  // Load starter template
  const handleLoadTemplate = (tpl: CompleteDesign) => {
    setActiveDesign(tpl);
    pushHistory(tpl);
    setSelectedIds([]);
    addToast(`Template "${tpl.title}" applied!`, 'success');
  };

  // Reset Design
  const handleResetDesign = () => {
    const emptyDesign: CompleteDesign = {
      ...activeDesign,
      views: {
        front: { objects: [] },
        back: { objects: [] },
        leftSleeve: { objects: [] },
        rightSleeve: { objects: [] },
      },
      updatedAt: Date.now(),
    };
    setActiveDesign(emptyDesign);
    pushHistory(emptyDesign);
    setSelectedIds([]);
    addToast('Custom design reset', 'info');
  };

  // Save Design
  const handleSaveDesign = () => {
    saveDesign(activeDesign);
  };

  // Add to Cart
  const handleAddToCart = () => {
    const garmentOpt = GARMENT_OPTIONS.find((g) => g.id === activeDesign.garmentId) || GARMENT_OPTIONS[0];

    const hasFront = (activeDesign.views.front?.objects || []).length > 0;
    const hasBack = (activeDesign.views.back?.objects || []).length > 0;
    const hasLeft = (activeDesign.views.leftSleeve?.objects || []).length > 0;
    const hasRight = (activeDesign.views.rightSleeve?.objects || []).length > 0;

    const printLocations: string[] = [];
    if (hasFront) printLocations.push('Front Chest');
    if (hasBack) printLocations.push('Back Full');
    if (hasLeft) printLocations.push('Left Sleeve');
    if (hasRight) printLocations.push('Right Sleeve');
    if (printLocations.length === 0) printLocations.push('Standard Blank');

    const frontCost = hasFront ? 199 : 0;
    const backCost = hasBack ? 199 : 0;
    const sleeveCost = (hasLeft ? 99 : 0) + (hasRight ? 99 : 0);
    const unitPrice = garmentOpt.basePrice + frontCost + backCost + sleeveCost;

    addToCart({
      id: `cart-custom-${Date.now()}`,
      productId: `prod-${activeDesign.garmentId}`,
      productName: `Custom ${garmentOpt.name}`,
      garmentType: activeDesign.garmentId,
      colorName: activeDesign.shirtColorName,
      colorHex: activeDesign.shirtColor,
      size: selectedSize,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
      customDesign: JSON.parse(JSON.stringify(activeDesign)),
      printLocations,
    });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          handleDeleteObjects(selectedIds);
        }
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl + Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handleRedo();
      }

      // Duplicate: Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          handleDuplicateObjects(selectedIds);
        }
      }

      // Arrow keys to nudge movement
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedIds.length > 0) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 2;
          selectedIds.forEach((id) => {
            const obj = designRef.current.views[activeView]?.objects.find((o) => o.id === id);
            if (!obj) return;
            let nx = obj.x;
            let ny = obj.y;
            if (e.key === 'ArrowUp') ny -= step;
            if (e.key === 'ArrowDown') ny += step;
            if (e.key === 'ArrowLeft') nx -= step;
            if (e.key === 'ArrowRight') nx += step;
            handleUpdateObject(id, { x: nx, y: ny }, true);
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, activeView, handleDeleteObjects, handleDuplicateObjects, handleUndo, handleRedo, handleUpdateObject]);

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-stone-100 overflow-hidden select-none">
      {/* Top Controls Bar */}
      <DesignerTopBar
        design={activeDesign}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          setSelectedIds([]);
        }}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        smartGuidesEnabled={smartGuidesEnabled}
        setSmartGuidesEnabled={setSmartGuidesEnabled}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        onSaveDesign={handleSaveDesign}
        onResetDesign={handleResetDesign}
        onOpenPreview={() => setPreviewModalOpen(true)}
        onAddToCart={handleAddToCart}
      />

      {/* Main Studio 3-Pane Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Garment, Uploads, Text, Stickers, Layers */}
        <div className="hidden md:flex h-full">
          <DesignerLeftSidebar
            design={activeDesign}
            activeView={activeView}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onAddObject={handleAddObject}
            onUpdateDesignGarment={handleUpdateDesignGarment}
            onLoadTemplate={handleLoadTemplate}
            onReorderObject={(id, dir) => handleReorderObject(id, dir)}
            onUpdateObject={(id, u) => handleUpdateObject(id, u, true)}
            onDeleteObjects={handleDeleteObjects}
            addToast={addToast}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onOpenSizeGuide={() => setSizeGuideOpen(true)}
          />
        </div>

        {/* Center: Canvas Workspace */}
        <div className="flex-1 h-full bg-[#f4f3ef] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Quick Size Switcher above canvas on desktop */}
          <div className="absolute top-3 left-4 z-20 hidden md:flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-xl border border-stone-200 text-xs shadow-xs max-w-[calc(100%-120px)] overflow-x-auto">
            <span className="text-[11px] font-bold text-stone-600 pl-2 pr-1 shrink-0">Size:</span>
            <div className="flex items-center gap-1">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-colors shrink-0 ${
                    selectedSize === s
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-100 border border-stone-200/60'
                  }`}
                  title={`Select size ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-[10px] font-bold text-amber-800 hover:text-amber-900 px-2 py-0.5 rounded-md hover:bg-amber-50 transition-colors shrink-0 flex items-center gap-1 border-l border-stone-200 ml-1"
            >
              <Ruler className="w-3 h-3" />
              <span>Chart</span>
            </button>
          </div>

          <DesignerCanvas
            design={activeDesign}
            activeView={activeView}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onUpdateObject={handleUpdateObject}
            onDeleteObjects={handleDeleteObjects}
            onDuplicateObjects={handleDuplicateObjects}
            onReorderObject={handleReorderObject}
            smartGuidesEnabled={smartGuidesEnabled}
            zoomLevel={zoomLevel}
          />
        </div>

        {/* Right Sidebar: Object Transformation & Inspector */}
        <div className="hidden lg:flex h-full">
          <DesignerRightSidebar
            design={activeDesign}
            activeView={activeView}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onUpdateObject={handleUpdateObject}
            onDeleteObjects={handleDeleteObjects}
            onDuplicateObjects={handleDuplicateObjects}
            onReorderObject={handleReorderObject}
            onGroupObjects={handleGroupObjects}
            onUngroupObjects={handleUngroupObjects}
          />
        </div>
      </div>

      {/* MOBILE BOTTOM TOOLBAR (< md screens) */}
      <div className="md:hidden bg-white border-t border-stone-200 p-2 flex items-center justify-around shrink-0 z-30">
        <button
          onClick={() => setMobileDrawerTab('tools')}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700 p-1"
        >
          <Shirt className="w-5 h-5 text-amber-700" />
          <span>Add & Style</span>
        </button>

        <button
          onClick={() => setMobileDrawerTab('inspector')}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700 p-1"
        >
          <SlidersHorizontal className="w-5 h-5 text-stone-700" />
          <span>Edit ({selectedIds.length})</span>
        </button>

        <button
          onClick={() => setPreviewModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700 p-1"
        >
          <Sparkles className="w-5 h-5 text-stone-700" />
          <span>Preview</span>
        </button>

        <button
          onClick={handleAddToCart}
          className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
        >
          <span>Add to Bag</span>
        </button>
      </div>

      {/* Mobile Drawer Bottom Sheet */}
      {mobileDrawerTab && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end"
          onClick={() => setMobileDrawerTab(null)}
        >
          <div
            className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <h4 className="font-bold text-sm text-stone-900 font-display">
                {mobileDrawerTab === 'tools' ? 'Add Elements & Garment Options' : 'Object Inspector'}
              </h4>
              <button
                onClick={() => setMobileDrawerTab(null)}
                className="p-1.5 text-stone-500 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {mobileDrawerTab === 'tools' ? (
                <DesignerLeftSidebar
                  design={activeDesign}
                  activeView={activeView}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  onAddObject={(obj) => {
                    handleAddObject(obj);
                    setMobileDrawerTab(null);
                  }}
                  onUpdateDesignGarment={handleUpdateDesignGarment}
                  onLoadTemplate={(tpl) => {
                    handleLoadTemplate(tpl);
                    setMobileDrawerTab(null);
                  }}
                  onReorderObject={(id, dir) => handleReorderObject(id, dir)}
                  onUpdateObject={(id, u) => handleUpdateObject(id, u, true)}
                  onDeleteObjects={handleDeleteObjects}
                  addToast={addToast}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                  onOpenSizeGuide={() => setSizeGuideOpen(true)}
                />
              ) : (
                <DesignerRightSidebar
                  design={activeDesign}
                  activeView={activeView}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  onUpdateObject={handleUpdateObject}
                  onDeleteObjects={(ids) => {
                    handleDeleteObjects(ids);
                    setMobileDrawerTab(null);
                  }}
                  onDuplicateObjects={handleDuplicateObjects}
                  onReorderObject={handleReorderObject}
                  onGroupObjects={handleGroupObjects}
                  onUngroupObjects={handleUngroupObjects}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 360 Full Screen Preview Modal */}
      {previewModalOpen && (
        <DesignPreviewModal
          design={activeDesign}
          onClose={() => setPreviewModalOpen(false)}
          onAddToCart={handleAddToCart}
          addToast={addToast}
        />
      )}

      {/* Interactive Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        garmentName={activeDesign.title || 'Studio Custom T-Shirt'}
      />
    </div>
  );
};
