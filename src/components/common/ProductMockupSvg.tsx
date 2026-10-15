import React, { useId } from 'react';
import { GarmentType, PrintView } from '../../types';
import { getPrintAreaBounds } from '../../data/printAreas';

interface ProductMockupSvgProps {
  color: string;
  shadowColor: string;
  view: PrintView;
  productType: GarmentType;
  className: string;
  showPrintAreaGuide: boolean;
}

const PRINT_LABELS: Partial<Record<GarmentType, string>> = {
  'ceramic-cup': 'CUP WRAP PRINT AREA',
  'photo-pillow': 'PILLOW PRINT AREA',
  'sipper-bottle': 'BOTTLE PRINT AREA',
  keychain: 'KEYCHAIN PRINT AREA',
  'photo-frame': 'PHOTO PRINT AREA',
  'mobile-case': 'CASE PRINT AREA',
};

export const ProductMockupSvg: React.FC<ProductMockupSvgProps> = ({
  color,
  shadowColor,
  view,
  productType,
  className,
  showPrintAreaGuide,
}) => {
  const gradientId = useId().replace(/:/g, '');
  const bounds = getPrintAreaBounds(productType, view);
  const label = PRINT_LABELS[productType] || 'PRINT AREA';

  const renderProduct = () => {
    switch (productType) {
      case 'ceramic-cup':
        return (
          <g filter={`url(#shadow-${gradientId})`}>
            <path d="M 325 215 C 430 205 430 365 325 355" fill="none" stroke={shadowColor} strokeWidth="24" />
            <path d="M 325 215 C 410 210 410 350 325 355" fill="none" stroke={color} strokeWidth="13" />
            <rect x="100" y="190" width="250" height="205" rx="20" fill={color} stroke={shadowColor} strokeWidth="4" />
            <ellipse cx="225" cy="193" rx="125" ry="17" fill={color} stroke={shadowColor} strokeWidth="4" />
            <ellipse cx="225" cy="195" rx="105" ry="9" fill="#0f172a" opacity="0.14" />
            <path d="M 112 215 Q 130 215 130 245 L 130 350" fill="none" stroke="#ffffff" strokeWidth="10" opacity="0.2" />
            <path d="M 115 370 Q 225 390 335 370" fill="none" stroke={shadowColor} strokeWidth="3" opacity="0.22" />
          </g>
        );
      case 'photo-pillow':
        return (
          <g filter={`url(#shadow-${gradientId})`}>
            <path d="M 118 150 Q 250 175 382 150 Q 355 300 382 450 Q 250 425 118 450 Q 145 300 118 150 Z" fill={shadowColor} opacity="0.18" />
            <rect x="105" y="145" width="290" height="310" rx="42" fill={color} stroke={shadowColor} strokeWidth="5" />
            <rect x="118" y="158" width="264" height="284" rx="34" fill={`url(#surface-${gradientId})`} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" />
            <path d="M 135 180 Q 160 235 140 290 M 365 180 Q 340 235 360 290 M 140 405 Q 185 385 220 405 M 360 405 Q 315 385 280 405" fill="none" stroke={shadowColor} strokeWidth="4" opacity="0.18" />
            <rect x="111" y="151" width="278" height="298" rx="38" fill="none" stroke="#ffffff" strokeOpacity="0.24" strokeWidth="2" strokeDasharray="3 5" />
          </g>
        );
      case 'sipper-bottle':
        return (
          <g filter={`url(#shadow-${gradientId})`}>
            <path d="M 218 103 L 282 103 L 282 140 L 302 158 L 312 190 L 304 456 Q 250 480 196 456 L 188 190 L 198 158 L 218 140 Z" fill={color} stroke={shadowColor} strokeWidth="4" />
            <path d="M 218 103 L 282 103 L 282 140 L 218 140 Z" fill={shadowColor} opacity="0.8" />
            <rect x="208" y="72" width="84" height="37" rx="9" fill={color} stroke={shadowColor} strokeWidth="4" />
            <rect x="227" y="57" width="46" height="22" rx="8" fill={shadowColor} />
            <path d="M 200 173 Q 250 188 300 173 M 198 442 Q 250 460 302 442" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="4" />
            <path d="M 211 195 L 211 420" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="9" strokeLinecap="round" />
            <path d="M 290 200 L 290 420" stroke={shadowColor} strokeOpacity="0.16" strokeWidth="7" strokeLinecap="round" />
          </g>
        );
      case 'keychain':
        return (
          <g filter={`url(#shadow-${gradientId})`}>
            <circle cx="250" cy="183" r="43" fill="none" stroke={shadowColor} strokeWidth="12" />
            <circle cx="250" cy="183" r="30" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.65" />
            <path d="M 250 225 L 250 246" stroke={shadowColor} strokeWidth="12" />
            <rect x="155" y="235" width="190" height="220" rx="42" fill={color} stroke={shadowColor} strokeWidth="5" />
            <rect x="166" y="246" width="168" height="198" rx="34" fill={`url(#surface-${gradientId})`} stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
            <circle cx="182" cy="267" r="6" fill="#ffffff" opacity="0.6" />
          </g>
        );
      case 'photo-frame':
        return (
          <g filter={`url(#shadow-${gradientId})`}>
            <rect x="72" y="115" width="356" height="370" rx="9" fill={color} stroke={shadowColor} strokeWidth="8" />
            <rect x="99" y="142" width="302" height="316" rx="3" fill="#f8fafc" stroke={shadowColor} strokeWidth="3" />
            <rect x="115" y="158" width="270" height="284" fill={color} opacity="0.15" />
            <rect x="115" y="158" width="270" height="284" fill="none" stroke={shadowColor} strokeOpacity="0.28" strokeWidth="2" />
            <path d="M 82 125 L 418 125 M 82 475 L 418 475" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="3" />
          </g>
        );
      case 'mobile-case':
        return (
          <g filter={`url(#shadow-${gradientId})`}>
            <rect x="145" y="72" width="210" height="456" rx="38" fill={shadowColor} />
            <rect x="154" y="80" width="192" height="440" rx="31" fill={color} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" />
            <rect x="169" y="98" width="94" height="100" rx="24" fill={shadowColor} />
            <circle cx="193" cy="123" r="12" fill="#111827" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="237" cy="123" r="12" fill="#111827" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="193" cy="166" r="9" fill="#f8fafc" opacity="0.75" />
            <rect x="216" y="507" width="68" height="5" rx="2.5" fill={shadowColor} opacity="0.7" />
            <path d="M 162 225 L 162 440" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.25" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 500 600"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`surface-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="55%" stopColor={color} stopOpacity="0.06" />
          <stop offset="100%" stopColor={shadowColor} stopOpacity="0.22" />
        </linearGradient>
        <filter id={`shadow-${gradientId}`} x="-15%" y="-10%" width="130%" height="125%">
          <feDropShadow dx="0" dy="12" stdDeviation="13" floodColor="#000000" floodOpacity="0.16" />
        </filter>
      </defs>

      {renderProduct()}

      {showPrintAreaGuide && (
        <g>
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
            rx="5"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="6 5"
            strokeOpacity="0.85"
          />
          <text
            x={bounds.x + bounds.width / 2}
            y={bounds.y - 9}
            fill="#4f46e5"
            fontSize="9"
            fontFamily="sans-serif"
            fontWeight="700"
            letterSpacing="0.5"
            textAnchor="middle"
          >
            {label}
          </text>
        </g>
      )}
    </svg>
  );
};
