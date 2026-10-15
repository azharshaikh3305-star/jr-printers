import React, { useRef, useState, useEffect, useCallback } from 'react';
import { DesignObject, CompleteDesign, PrintView, GarmentType } from '../../types';
import { TShirtBaseSvg } from '../common/TShirtBaseSvg';
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  FlipHorizontal,
  FlipVertical,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Move,
  Layers,
  AlertTriangle,
} from 'lucide-react';

interface DesignerCanvasProps {
  design: CompleteDesign;
  activeView: PrintView;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onUpdateObject: (id: string, updates: Partial<DesignObject>, recordHistory?: boolean) => void;
  onDeleteObjects: (ids: string[]) => void;
  onDuplicateObjects: (ids: string[]) => void;
  onReorderObject: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  smartGuidesEnabled: boolean;
  zoomLevel: number; // 0.75 to 1.5
}

// Coordinate space inside the T-shirt print box
// The T-shirt viewBox is 500 x 600
// Printable area on front/back: X: 165 to 335 (width 170), Y: 130 to 390 (height 260)
// On sleeves: X: 200 to 300 (width 100), Y: 180 to 360 (height 180)
export const PRINT_BOUNDS: Record<PrintView, { x: number; y: number; width: number; height: number }> = {
  front: { x: 165, y: 130, width: 170, height: 260 },
  back: { x: 165, y: 130, width: 170, height: 260 },
  leftSleeve: { x: 200, y: 180, width: 100, height: 180 },
  rightSleeve: { x: 200, y: 180, width: 100, height: 180 },
};

type DragMode = 'move' | 'rotate' | 'resize-tl' | 'resize-tc' | 'resize-tr' | 'resize-ml' | 'resize-mr' | 'resize-bl' | 'resize-bc' | 'resize-br';

export const DesignerCanvas: React.FC<DesignerCanvasProps> = ({
  design,
  activeView,
  selectedIds,
  setSelectedIds,
  onUpdateObject,
  onDeleteObjects,
  onDuplicateObjects,
  onReorderObject,
  smartGuidesEnabled,
  zoomLevel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentObjects = design.views[activeView]?.objects || [];

  // Dragging / Resizing interaction state
  const [dragState, setDragState] = useState<{
    mode: DragMode;
    startX: number;
    startY: number;
    initialObjects: Map<string, { x: number; y: number; width: number; height: number; rotation: number }>;
    centerPoint?: { x: number; y: number };
  } | null>(null);

  // Active smart guides lines to render
  const [guideLines, setGuideLines] = useState<{
    verticalCenter?: boolean;
    horizontalCenter?: boolean;
  }>({});

  const [hasOutOfBoundsObjects, setHasOutOfBoundsObjects] = useState(false);

  const printArea = PRINT_BOUNDS[activeView];

  // Helper to convert client mouse/touch point to SVG canvas coordinates (0-500, 0-600)
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 500;
    const y = ((clientY - rect.top) / rect.height) * 600;
    return { x, y };
  }, []);

  // Check if objects are outside printable boundaries
  useEffect(() => {
    const isOut = currentObjects.some((obj) => {
      const halfW = obj.width / 2;
      const halfH = obj.height / 2;
      const left = obj.x - halfW;
      const right = obj.x + halfW;
      const top = obj.y - halfH;
      const bottom = obj.y + halfH;
      return (
        left < printArea.x ||
        right > printArea.x + printArea.width ||
        top < printArea.y ||
        bottom > printArea.y + printArea.height
      );
    });
    setHasOutOfBoundsObjects(isOut);
  }, [currentObjects, printArea]);

  // Primary selected object (if only 1 selected)
  const primarySelected = currentObjects.find((o) => o.id === selectedIds[0]);

  // Handle pointer down on an object
  const handleObjectPointerDown = (e: React.PointerEvent, objId: string) => {
    e.stopPropagation();
    const targetObj = currentObjects.find((o) => o.id === objId);
    if (!targetObj || targetObj.locked) return;

    let nextSelected = [...selectedIds];
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      if (nextSelected.includes(objId)) {
        nextSelected = nextSelected.filter((id) => id !== objId);
      } else {
        nextSelected.push(objId);
      }
    } else {
      if (!selectedIds.includes(objId)) {
        nextSelected = [objId];
      }
    }
    setSelectedIds(nextSelected);

    // If part of a group, select all group members
    if (targetObj.groupId) {
      const groupMembers = currentObjects.filter((o) => o.groupId === targetObj.groupId).map((o) => o.id);
      setSelectedIds(Array.from(new Set([...nextSelected, ...groupMembers])));
    }

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const initialMap = new Map();
    (nextSelected.length > 0 ? nextSelected : [objId]).forEach((id) => {
      const o = currentObjects.find((item) => item.id === id);
      if (o) {
        initialMap.set(id, { x: o.x, y: o.y, width: o.width, height: o.height, rotation: o.rotation });
      }
    });

    setDragState({
      mode: 'move',
      startX: x,
      startY: y,
      initialObjects: initialMap,
    });
  };

  // Handle pointer down on resize or rotate handles
  const handleHandlePointerDown = (e: React.PointerEvent, mode: DragMode) => {
    e.stopPropagation();
    if (!primarySelected || primarySelected.locked) return;

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const initialMap = new Map();
    initialMap.set(primarySelected.id, {
      x: primarySelected.x,
      y: primarySelected.y,
      width: primarySelected.width,
      height: primarySelected.height,
      rotation: primarySelected.rotation,
    });

    setDragState({
      mode,
      startX: x,
      startY: y,
      initialObjects: initialMap,
      centerPoint: { x: primarySelected.x, y: primarySelected.y },
    });
  };

  // Window pointer move and pointer up listeners during active dragging
  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { x: curX, y: curY } = getCanvasCoords(e.clientX, e.clientY);
      const deltaX = curX - dragState.startX;
      const deltaY = curY - dragState.startY;

      if (dragState.mode === 'move') {
        let snapXGuide = false;
        let snapYGuide = false;

        dragState.initialObjects.forEach((initial, id) => {
          let newX = initial.x + deltaX;
          let newY = initial.y + deltaY;

          // Smart guide snapping for the primary moving object
          if (smartGuidesEnabled && id === selectedIds[0]) {
            const printCenterX = printArea.x + printArea.width / 2;
            const printCenterY = printArea.y + printArea.height / 2;
            const snapThreshold = 4;

            if (Math.abs(newX - printCenterX) < snapThreshold) {
              newX = printCenterX;
              snapXGuide = true;
            }
            if (Math.abs(newY - printCenterY) < snapThreshold) {
              newY = printCenterY;
              snapYGuide = true;
            }
          }

          onUpdateObject(id, { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 }, false);
        });

        setGuideLines({
          verticalCenter: snapXGuide,
          horizontalCenter: snapYGuide,
        });
      } else if (dragState.mode === 'rotate') {
        if (!primarySelected || !dragState.centerPoint) return;
        const center = dragState.centerPoint;
        const initial = dragState.initialObjects.get(primarySelected.id);
        if (!initial) return;

        const rad = Math.atan2(curY - center.y, curX - center.x);
        let deg = Math.round((rad * 180) / Math.PI + 90);
        if (deg < 0) deg += 360;

        // Angle snapping near 0, 45, 90, 180, 270
        const snapThreshold = 4;
        const angles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        for (const snap of angles) {
          if (Math.abs(deg - snap) < snapThreshold) {
            deg = snap % 360;
            break;
          }
        }

        onUpdateObject(primarySelected.id, { rotation: deg }, false);
      } else if (dragState.mode.startsWith('resize-')) {
        if (!primarySelected) return;
        const initial = dragState.initialObjects.get(primarySelected.id);
        if (!initial) return;

        const handle = dragState.mode.replace('resize-', '');
        const maintainAspect = primarySelected.keepAspectRatio !== false;
        const origAspect = initial.width / initial.height;

        let newW = initial.width;
        let newH = initial.height;
        let newX = initial.x;
        let newY = initial.y;

        // Resize calculation based on handle dragged
        if (handle.includes('r')) {
          newW = Math.max(20, initial.width + deltaX);
        } else if (handle.includes('l')) {
          newW = Math.max(20, initial.width - deltaX);
          newX = initial.x + (initial.width - newW) / 2;
        }

        if (handle.includes('b')) {
          newH = Math.max(20, initial.height + deltaY);
        } else if (handle.includes('t')) {
          newH = Math.max(20, initial.height - deltaY);
          newY = initial.y + (initial.height - newH) / 2;
        }

        if (maintainAspect) {
          if (handle === 'tl' || handle === 'tr' || handle === 'bl' || handle === 'br') {
            const scale = Math.max(newW / initial.width, newH / initial.height);
            newW = Math.round(initial.width * scale);
            newH = Math.round(newW / origAspect);
          } else if (handle === 'tc' || handle === 'bc') {
            newW = Math.round(newH * origAspect);
          } else if (handle === 'ml' || handle === 'mr') {
            newH = Math.round(newW / origAspect);
          }
        }

        onUpdateObject(
          primarySelected.id,
          {
            width: Math.max(20, Math.round(newW)),
            height: Math.max(20, Math.round(newH)),
            x: Math.round(newX),
            y: Math.round(newY),
          },
          false
        );
      }
    };

    const handlePointerUp = () => {
      // Record history on drag completion
      if (dragState) {
        dragState.initialObjects.forEach((_, id) => {
          const current = currentObjects.find((o) => o.id === id);
          if (current) {
            onUpdateObject(id, { x: current.x, y: current.y, width: current.width, height: current.height, rotation: current.rotation }, true);
          }
        });
      }
      setDragState(null);
      setGuideLines({});
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, getCanvasCoords, onUpdateObject, primarySelected, selectedIds, currentObjects, smartGuidesEnabled, printArea]);

  // Click on background canvas clears selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setSelectedIds([]);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 select-none overflow-hidden">
      {/* Outer Scaled Viewport Container */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: dragState ? 'none' : 'transform 0.15s ease-out',
        }}
        className="relative w-[290px] xs:w-[330px] sm:w-[440px] md:w-[480px] lg:w-[500px] max-w-[92vw] aspect-[500/600] touch-none cursor-default"
      >
        {/* Realistic SVG Garment Base Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <TShirtBaseSvg
            color={design.shirtColor}
            view={activeView}
            garmentType={design.garmentId}
            showPrintAreaGuide={true}
          />
        </div>

        {/* Smart Snapping Center Lines Overlay */}
        {smartGuidesEnabled && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
            viewBox="0 0 500 600"
          >
            {guideLines.verticalCenter && (
              <line
                x1={printArea.x + printArea.width / 2}
                y1="80"
                x2={printArea.x + printArea.width / 2}
                y2="520"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            )}
            {guideLines.horizontalCenter && (
              <line
                x1="100"
                y1={printArea.y + printArea.height / 2}
                x2="400"
                y2={printArea.y + printArea.height / 2}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            )}
          </svg>
        )}

        {/* Printable Area Interactive Stage Container */}
        <div className="absolute inset-0 overflow-visible">
          {/* Render All Canvas Objects in zIndex order */}
          {currentObjects
            .filter((o) => o.visible !== false)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((obj) => {
              const isSelected = selectedIds.includes(obj.id);
              const halfW = obj.width / 2;
              const halfH = obj.height / 2;

              return (
                <div
                  key={obj.id}
                  onPointerDown={(e) => handleObjectPointerDown(e, obj.id)}
                  style={{
                    position: 'absolute',
                    left: `${(obj.x / 500) * 100}%`,
                    top: `${(obj.y / 600) * 100}%`,
                    width: `${(obj.width / 500) * 100}%`,
                    height: `${(obj.height / 600) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${obj.rotation}deg) scale(${obj.flipX ? -1 : 1}, ${obj.flipY ? -1 : 1})`,
                    transformOrigin: 'center center',
                    opacity: obj.opacity ?? 1,
                    zIndex: obj.zIndex + 10,
                    cursor: obj.locked ? 'not-allowed' : 'move',
                  }}
                  className={`group ${isSelected ? 'ring-2 ring-indigo-500/80' : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-stone-400'}`}
                >
                  {/* Object Content: Image, Sticker, or Text */}
                  {obj.type === 'text' ? (
                    <div
                      style={{
                        fontFamily: obj.fontFamily || 'Plus Jakarta Sans',
                        fontSize: `${(obj.fontSize || 20) * (340 / 500)}px`,
                        color: obj.textColor || '#000000',
                        fontWeight: obj.fontWeight || 'bold',
                        fontStyle: obj.fontStyle || 'normal',
                        textDecoration: obj.textDecoration || 'none',
                        textAlign: obj.textAlign || 'center',
                        letterSpacing: `${obj.letterSpacing || 0}px`,
                        lineHeight: obj.lineHeight || 1.1,
                      }}
                      className="w-full h-full flex items-center justify-center select-none text-center break-words px-1"
                    >
                      {obj.text}
                    </div>
                  ) : (
                    /* Image / Sticker */
                    <div className="w-full h-full relative flex items-center justify-center">
                      <img
                        src={obj.imageUrl}
                        alt="Custom Graphic"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  )}

                  {/* Lock Indicator Tag if locked */}
                  {obj.locked && isSelected && (
                    <div className="absolute top-1 right-1 bg-stone-900/80 text-white p-1 rounded-full">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

          {/* 8-Handle Bounding Box & Transformation Controls for Single Selection */}
          {primarySelected && selectedIds.length === 1 && !primarySelected.locked && (
            <div
              style={{
                position: 'absolute',
                left: `${(primarySelected.x / 500) * 100}%`,
                top: `${(primarySelected.y / 600) * 100}%`,
                width: `${(primarySelected.width / 500) * 100}%`,
                height: `${(primarySelected.height / 600) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${primarySelected.rotation}deg)`,
                transformOrigin: 'center center',
                zIndex: 40,
                pointerEvents: 'none',
              }}
              className="border-2 border-indigo-600 rounded-xs"
            >
              {/* Rotation Handle with vertical connector stalk above TC handle */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                <button
                  onPointerDown={(e) => handleHandlePointerDown(e, 'rotate')}
                  className="w-5 h-5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full shadow-md flex items-center justify-center hover:scale-125 cursor-grab active:cursor-grabbing transition-transform"
                  title="Drag to Rotate (Snaps to 45°/90°)"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
                <div className="w-0.5 h-2 bg-indigo-600" />
              </div>

              {/* 8 Bounding Resize Handles */}
              {/* 1. Top-Left */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-tl')}
                className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-nwse-resize pointer-events-auto"
              />
              {/* 2. Top-Center */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-tc')}
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-ns-resize pointer-events-auto"
              />
              {/* 3. Top-Right */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-tr')}
                className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-nesw-resize pointer-events-auto"
              />
              {/* 4. Middle-Left */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-ml')}
                className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-ew-resize pointer-events-auto"
              />
              {/* 5. Middle-Right */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-mr')}
                className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-ew-resize pointer-events-auto"
              />
              {/* 6. Bottom-Left */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-bl')}
                className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-nesw-resize pointer-events-auto"
              />
              {/* 7. Bottom-Center */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-bc')}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-ns-resize pointer-events-auto"
              />
              {/* 8. Bottom-Right */}
              <div
                onPointerDown={(e) => handleHandlePointerDown(e, 'resize-br')}
                className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-xs shadow-xs hover:scale-125 cursor-nwse-resize pointer-events-auto"
              />

              {/* Floating Quick Action Toolbar (Attached to Top) */}
              <div
                style={{
                  transform: `rotate(${-primarySelected.rotation}deg)`,
                }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-stone-900 text-white rounded-xl shadow-xl px-2 py-1 flex items-center gap-1 text-xs pointer-events-auto z-50 whitespace-nowrap"
              >
                <button
                  onClick={() => onDuplicateObjects([primarySelected.id])}
                  className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-200 hover:text-white"
                  title="Duplicate (Ctrl+D)"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    onUpdateObject(primarySelected.id, {
                      flipX: !primarySelected.flipX,
                    })
                  }
                  className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-200 hover:text-white"
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    onUpdateObject(primarySelected.id, {
                      flipY: !primarySelected.flipY,
                    })
                  }
                  className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-200 hover:text-white"
                  title="Flip Vertical"
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onReorderObject(primarySelected.id, 'up')}
                  className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-200 hover:text-white"
                  title="Bring Forward"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onReorderObject(primarySelected.id, 'down')}
                  className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-200 hover:text-white"
                  title="Send Backward"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    onUpdateObject(primarySelected.id, {
                      locked: !primarySelected.locked,
                    })
                  }
                  className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-200 hover:text-white"
                  title={primarySelected.locked ? 'Unlock' : 'Lock'}
                >
                  {primarySelected.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
                <div className="w-px h-4 bg-stone-700 mx-0.5" />
                <button
                  onClick={() => onDeleteObjects([primarySelected.id])}
                  className="p-1.5 hover:bg-rose-950 text-rose-400 hover:text-rose-300 rounded-lg"
                  title="Delete (Del)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Multi-Selection Bounding Overlay if 2+ selected */}
          {selectedIds.length > 1 && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-indigo-950 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold shadow-md pointer-events-auto flex items-center gap-2 z-50">
              <span>{selectedIds.length} Objects Selected</span>
              <button
                onClick={() => onDuplicateObjects(selectedIds)}
                className="hover:text-white underline"
              >
                Duplicate All
              </button>
              <span>·</span>
              <button
                onClick={() => onDeleteObjects(selectedIds)}
                className="text-rose-400 hover:text-rose-300"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Printable Area Warning Banner if object spills over boundary */}
        {hasOutOfBoundsObjects && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-500/90 text-stone-950 font-bold px-3 py-1 rounded-lg text-[11px] shadow-md flex items-center gap-1.5 backdrop-blur-xs pointer-events-none z-40">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Artwork extends outside printable zone</span>
          </div>
        )}
      </div>
    </div>
  );
};
