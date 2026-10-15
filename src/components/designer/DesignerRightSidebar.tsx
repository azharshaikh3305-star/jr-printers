import React from 'react';
import { DesignObject, CompleteDesign, PrintView } from '../../types';
import { PRINT_BOUNDS } from './DesignerCanvas';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  ArrowUpToLine,
  ArrowDownToLine,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Lock,
  Unlock,
  FlipHorizontal,
  FlipVertical,
  Link,
  Unlink,
  Group,
  Ungroup,
  Sliders,
  Type,
  Bold,
  Italic,
  Underline,
  RotateCw,
} from 'lucide-react';

interface DesignerRightSidebarProps {
  design: CompleteDesign;
  activeView: PrintView;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onUpdateObject: (id: string, updates: Partial<DesignObject>, recordHistory?: boolean) => void;
  onDeleteObjects: (ids: string[]) => void;
  onDuplicateObjects: (ids: string[]) => void;
  onReorderObject: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onGroupObjects: (ids: string[]) => void;
  onUngroupObjects: (ids: string[]) => void;
}

export const DesignerRightSidebar: React.FC<DesignerRightSidebarProps> = ({
  design,
  activeView,
  selectedIds,
  setSelectedIds,
  onUpdateObject,
  onDeleteObjects,
  onDuplicateObjects,
  onReorderObject,
  onGroupObjects,
  onUngroupObjects,
}) => {
  const currentObjects = design.views[activeView]?.objects || [];
  const primary = currentObjects.find((o) => o.id === selectedIds[0]);
  const isMultiple = selectedIds.length > 1;

  const printArea = PRINT_BOUNDS[activeView];

  // If nothing is selected, display helpful overview tips
  if (selectedIds.length === 0 || !primary) {
    return (
      <div className="w-72 bg-white border-l border-stone-200 p-6 flex flex-col justify-between text-xs text-stone-500 shrink-0 select-none">
        <div>
          <h4 className="font-display font-bold text-stone-900 text-sm mb-2">
            Inspector Panel
          </h4>
          <p className="leading-relaxed text-stone-500">
            Select any graphic, sticker, or text on the T-shirt to adjust position, dimensions, rotation, opacity, and alignment.
          </p>

          <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <h5 className="font-semibold text-stone-800 text-xs">Studio Shortcuts</h5>
            <div className="space-y-2 text-[11px] text-stone-600 font-mono">
              <div className="flex justify-between">
                <span>Move</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">Drag or Arrows</kbd>
              </div>
              <div className="flex justify-between">
                <span>Fast Move</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">Shift + Arrows</kbd>
              </div>
              <div className="flex justify-between">
                <span>Duplicate</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">Ctrl + D</kbd>
              </div>
              <div className="flex justify-between">
                <span>Delete</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">Del / Backspace</kbd>
              </div>
              <div className="flex justify-between">
                <span>Undo / Redo</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">Ctrl + Z / Shift+Z</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
          <span className="font-bold">Active View: </span>
          <span className="capitalize">{activeView}</span> · {currentObjects.length} layer(s)
        </div>
      </div>
    );
  }

  // Alignment functions
  const handleAlign = (type: 'left' | 'center-h' | 'right' | 'top' | 'middle-v' | 'bottom') => {
    selectedIds.forEach((id) => {
      const obj = currentObjects.find((o) => o.id === id);
      if (!obj) return;
      const halfW = obj.width / 2;
      const halfH = obj.height / 2;

      switch (type) {
        case 'left':
          onUpdateObject(id, { x: printArea.x + halfW });
          break;
        case 'center-h':
          onUpdateObject(id, { x: printArea.x + printArea.width / 2 });
          break;
        case 'right':
          onUpdateObject(id, { x: printArea.x + printArea.width - halfW });
          break;
        case 'top':
          onUpdateObject(id, { y: printArea.y + halfH });
          break;
        case 'middle-v':
          onUpdateObject(id, { y: printArea.y + printArea.height / 2 });
          break;
        case 'bottom':
          onUpdateObject(id, { y: printArea.y + printArea.height - halfH });
          break;
      }
    });
  };

  return (
    <aside className="w-72 sm:w-80 bg-white border-l border-stone-200 p-5 overflow-y-auto space-y-6 shrink-0 select-none">
      {/* Header with Type & Lock/Trash actions */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            {isMultiple ? 'Multi-Selection' : primary.type.toUpperCase()}
          </span>
          <h4 className="font-display font-bold text-stone-900 text-sm">
            {isMultiple ? `${selectedIds.length} Objects Selected` : primary.type === 'text' ? `Text: "${primary.text}"` : 'Graphic Object'}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateObjects(selectedIds)}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteObjects(selectedIds)}
            className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multi-Selection Grouping Banner */}
      {isMultiple && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-900">Group Objects</span>
          <button
            onClick={() => onGroupObjects(selectedIds)}
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 flex items-center gap-1"
          >
            <Group className="w-3.5 h-3.5" />
            Group
          </button>
        </div>
      )}

      {primary.groupId && !isMultiple && (
        <div className="bg-stone-100 p-2.5 rounded-xl flex items-center justify-between">
          <span className="text-xs text-stone-600">Part of a group</span>
          <button
            onClick={() => onUngroupObjects([primary.id])}
            className="text-xs font-bold text-stone-900 underline flex items-center gap-1"
          >
            <Ungroup className="w-3.5 h-3.5" />
            Ungroup
          </button>
        </div>
      )}

      {/* If Text Object: Full Typography Formatting Panel */}
      {primary.type === 'text' && !isMultiple && (
        <div className="space-y-4 pb-4 border-b border-stone-100">
          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Typography Settings
          </h5>

          <div>
            <label className="text-[11px] font-semibold text-stone-700 block mb-1">Text String</label>
            <input
              type="text"
              value={primary.text || ''}
              onChange={(e) => onUpdateObject(primary.id, { text: e.target.value })}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-stone-700 block mb-1">Font Family</label>
            <select
              value={primary.fontFamily || 'Syne'}
              onChange={(e) => onUpdateObject(primary.id, { fontFamily: e.target.value })}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
            >
              <option value="Syne">Syne</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              <option value="Bebas Neue">Bebas Neue</option>
              <option value="Permanent Marker">Permanent Marker</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Space Grotesk">Space Grotesk</option>
            </select>
          </div>

          {/* Bold, Italic, Underline & Alignment */}
          <div className="flex items-center gap-2">
            <div className="flex border border-stone-200 rounded-lg p-0.5 bg-stone-50">
              <button
                onClick={() =>
                  onUpdateObject(primary.id, {
                    fontWeight: primary.fontWeight === 'bold' ? 'normal' : 'bold',
                  })
                }
                className={`p-1.5 rounded ${
                  primary.fontWeight === 'bold' ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  onUpdateObject(primary.id, {
                    fontStyle: primary.fontStyle === 'italic' ? 'normal' : 'italic',
                  })
                }
                className={`p-1.5 rounded ${
                  primary.fontStyle === 'italic' ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  onUpdateObject(primary.id, {
                    textDecoration: primary.textDecoration === 'underline' ? 'none' : 'underline',
                  })
                }
                className={`p-1.5 rounded ${
                  primary.textDecoration === 'underline' ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Color picker */}
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="color"
                value={primary.textColor || '#ffffff'}
                onChange={(e) => onUpdateObject(primary.id, { textColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-stone-500">{primary.textColor}</span>
            </div>
          </div>
        </div>
      )}

      {/* Position & Size */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Dimensions & Bounds
          </h5>
          <button
            onClick={() =>
              onUpdateObject(primary.id, {
                keepAspectRatio: !primary.keepAspectRatio,
              })
            }
            className="text-[11px] font-semibold text-stone-600 flex items-center gap-1 hover:text-stone-900"
            title="Lock Aspect Ratio"
          >
            {primary.keepAspectRatio !== false ? (
              <>
                <Link className="w-3 h-3 text-emerald-600" />
                <span>Aspect Locked</span>
              </>
            ) : (
              <>
                <Unlink className="w-3 h-3 text-stone-400" />
                <span>Free Stretch</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-400 font-semibold block">Width</span>
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={primary.width}
                onChange={(e) => onUpdateObject(primary.id, { width: Math.max(10, Number(e.target.value)) })}
                className="w-16 bg-transparent font-mono font-bold text-stone-900 outline-none"
              />
              <span className="text-stone-400">px</span>
            </div>
          </div>
          <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] text-stone-400 font-semibold block">Height</span>
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={primary.height}
                onChange={(e) => onUpdateObject(primary.id, { height: Math.max(10, Number(e.target.value)) })}
                className="w-16 bg-transparent font-mono font-bold text-stone-900 outline-none"
              />
              <span className="text-stone-400">px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rotation Slider & Quick Preset Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Rotation Angle
          </h5>
          <span className="text-xs font-mono font-bold text-stone-900">
            {primary.rotation}°
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="360"
          value={primary.rotation}
          onChange={(e) => onUpdateObject(primary.id, { rotation: Number(e.target.value) })}
          className="w-full accent-stone-900"
        />

        {/* Quick Rotation Angle Snaps */}
        <div className="grid grid-cols-5 gap-1 mt-2">
          {[0, 45, 90, 180, 270].map((deg) => (
            <button
              key={deg}
              onClick={() => onUpdateObject(primary.id, { rotation: deg })}
              className={`py-1 rounded-md text-[11px] font-mono border transition-colors ${
                primary.rotation === deg
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

      {/* Opacity Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Opacity
          </h5>
          <span className="text-xs font-mono font-bold text-stone-900">
            {Math.round((primary.opacity ?? 1) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={Math.round((primary.opacity ?? 1) * 100)}
          onChange={(e) => onUpdateObject(primary.id, { opacity: Number(e.target.value) / 100 })}
          className="w-full accent-stone-900"
        />
      </div>

      {/* Canvas Print Area Alignment Tools */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Align To Printable Area
        </h5>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            onClick={() => handleAlign('left')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Left</span>
          </button>
          <button
            onClick={() => handleAlign('center-h')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700"
            title="Center Horizontally"
          >
            <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
            <span>Center H</span>
          </button>
          <button
            onClick={() => handleAlign('right')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
            <span>Right</span>
          </button>

          <button
            onClick={() => handleAlign('top')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700"
            title="Align Top"
          >
            <ArrowUpToLine className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
          <button
            onClick={() => handleAlign('middle-v')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700"
            title="Center Vertically"
          >
            <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
            <span>Center V</span>
          </button>
          <button
            onClick={() => handleAlign('bottom')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex flex-col items-center gap-1 text-[10px] font-semibold text-stone-700"
            title="Align Bottom"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Bottom</span>
          </button>
        </div>
      </div>

      {/* Layer Order Tools */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Layer Hierarchy
        </h5>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => onReorderObject(primary.id, 'top')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center gap-1.5"
          >
            <ArrowUpToLine className="w-3.5 h-3.5" />
            Bring to Front
          </button>
          <button
            onClick={() => onReorderObject(primary.id, 'bottom')}
            className="p-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center gap-1.5"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            Send to Back
          </button>
        </div>
      </div>
    </aside>
  );
};
