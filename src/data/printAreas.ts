import { GarmentType, PrintView } from '../types';

export interface PrintAreaBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const APPAREL_PRINT_AREAS: Record<PrintView, PrintAreaBounds> = {
  front: { x: 165, y: 130, width: 170, height: 260 },
  back: { x: 165, y: 130, width: 170, height: 260 },
  leftSleeve: { x: 200, y: 180, width: 100, height: 180 },
  rightSleeve: { x: 200, y: 180, width: 100, height: 180 },
};

const PRODUCT_PRINT_AREAS: Partial<Record<GarmentType, Partial<Record<PrintView, PrintAreaBounds>>>> = {
  'ceramic-cup': {
    front: { x: 145, y: 220, width: 190, height: 150 },
    back: { x: 145, y: 220, width: 190, height: 150 },
  },
  'photo-pillow': {
    front: { x: 140, y: 175, width: 220, height: 250 },
    back: { x: 140, y: 175, width: 220, height: 250 },
  },
  'sipper-bottle': {
    front: { x: 200, y: 180, width: 100, height: 250 },
    back: { x: 200, y: 180, width: 100, height: 250 },
  },
  keychain: {
    front: { x: 190, y: 255, width: 120, height: 135 },
    back: { x: 190, y: 255, width: 120, height: 135 },
  },
  'photo-frame': {
    front: { x: 135, y: 175, width: 230, height: 250 },
    back: { x: 135, y: 175, width: 230, height: 250 },
  },
  'mobile-case': {
    front: { x: 175, y: 210, width: 150, height: 250 },
    back: { x: 175, y: 210, width: 150, height: 250 },
  },
};

export const isApparelType = (garmentType: GarmentType): boolean =>
  garmentType === 'classic-crew' ||
  garmentType === 'heavyweight-tee' ||
  garmentType === 'oversized-boxy' ||
  garmentType === 'french-terry-hoodie' ||
  garmentType === 'pique-polo';

export const getPrintAreaBounds = (garmentType: GarmentType, view: PrintView): PrintAreaBounds => {
  if (isApparelType(garmentType)) {
    return APPAREL_PRINT_AREAS[view];
  }

  const productBounds = PRODUCT_PRINT_AREAS[garmentType]?.[view];
  return productBounds || PRODUCT_PRINT_AREAS[garmentType]?.front || APPAREL_PRINT_AREAS.front;
};
