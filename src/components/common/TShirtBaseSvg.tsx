import React from 'react';
import { GarmentType, PrintView } from '../../types';

interface TShirtBaseSvgProps {
  color: string;
  shadowColor?: string;
  view: PrintView;
  garmentType: GarmentType;
  className?: string;
  showPrintAreaGuide?: boolean;
}

export const TShirtBaseSvg: React.FC<TShirtBaseSvgProps> = ({
  color,
  shadowColor = '#1a1a1a',
  view,
  garmentType,
  className = 'w-full h-full',
  showPrintAreaGuide = false,
}) => {
  const isWhite = color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff';
  const collarInnerColor = isWhite ? '#e5e7eb' : '#111827';
  const isHoodie = garmentType === 'french-terry-hoodie';
  const isPolo = garmentType === 'pique-polo';
  const isOversized = garmentType === 'oversized-boxy';

  // Render front or back view
  if (view === 'front' || view === 'back') {
    return (
      <svg
        viewBox="0 0 500 600"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle realistic lighting gradient */}
          <linearGradient id={`fabric-shading-${view}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </linearGradient>

          {/* Sleeve and body drop shadow */}
          <filter id="soft-garment-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.12" />
          </filter>

          {/* Torso fold gradient */}
          <linearGradient id="body-fold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="85%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {/* Outer subtle shadow container */}
        <g filter="url(#soft-garment-shadow)">
          {/* T-Shirt Silhouette Outline */}
          {/* Standard / Oversized Crew Neck */}
          {!isHoodie ? (
            <path
              d={
                isOversized
                  ? 'M 160 55 C 190 75, 310 75, 340 55 L 450 145 C 440 180, 420 220, 395 240 L 370 190 L 375 540 C 375 550, 365 555, 355 555 L 145 555 C 135 555, 125 550, 125 540 L 130 190 L 105 240 C 80 220, 60 180, 50 145 Z'
                  : 'M 170 50 C 200 68, 300 68, 330 50 L 440 130 C 430 160, 410 195, 390 210 L 360 170 L 365 545 C 365 555, 355 560, 345 560 L 155 560 C 145 560, 135 555, 135 545 L 140 170 L 110 210 C 90 195, 70 160, 60 130 Z'
              }
              fill={color}
              stroke={shadowColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          ) : (
            /* Hoodie Silhouette with Hood & Pocket */
            <path
              d="M 175 40 C 195 30, 305 30, 325 40 L 445 135 C 435 175, 410 230, 385 245 L 365 190 L 370 545 C 370 555, 360 560, 350 560 L 150 560 C 140 560, 130 555, 130 545 L 135 190 L 115 245 C 90 230, 65 175, 55 135 Z"
              fill={color}
              stroke={shadowColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}

          {/* Photorealistic fabric shading layer */}
          <path
            d={
              isHoodie
                ? 'M 175 40 C 195 30, 305 30, 325 40 L 445 135 C 435 175, 410 230, 385 245 L 365 190 L 370 545 C 370 555, 360 560, 350 560 L 150 560 C 140 560, 130 555, 130 545 L 135 190 L 115 245 C 90 230, 65 175, 55 135 Z'
                : 'M 170 50 C 200 68, 300 68, 330 50 L 440 130 C 430 160, 410 195, 390 210 L 360 170 L 365 545 C 365 555, 355 560, 345 560 L 155 560 C 145 560, 135 555, 135 545 L 140 170 L 110 210 C 90 195, 70 160, 60 130 Z'
            }
            fill={`url(#fabric-shading-${view})`}
          />
          <path
            d="M 135 170 L 365 170 L 365 545 L 135 545 Z"
            fill="url(#body-fold-grad)"
          />

          {/* Sleeve Seams & Depth Creases */}
          <path
            d="M 170 50 C 160 110, 150 145, 140 170"
            stroke="#000000"
            strokeOpacity="0.18"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 330 50 C 340 110, 350 145, 360 170"
            stroke="#000000"
            strokeOpacity="0.18"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Collar Details */}
          {view === 'front' ? (
            !isHoodie && !isPolo ? (
              /* Front Crewneck Collar */
              <g>
                <path
                  d="M 170 50 C 185 102, 315 102, 330 50 C 315 88, 185 88, 170 50 Z"
                  fill={collarInnerColor}
                  opacity="0.3"
                />
                <path
                  d="M 170 50 C 188 95, 312 95, 330 50"
                  stroke={shadowColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Collar Ribbing Inner Accent */}
                <path
                  d="M 173 54 C 190 90, 310 90, 327 54"
                  stroke="#ffffff"
                  strokeOpacity="0.25"
                  strokeWidth="1.5"
                />
              </g>
            ) : isPolo ? (
              /* Polo Collar & Placket */
              <g>
                <path
                  d="M 170 50 L 220 110 L 250 85 L 280 110 L 330 50 L 285 45 L 250 55 L 215 45 Z"
                  fill={color}
                  stroke={shadowColor}
                  strokeWidth="1.5"
                />
                <rect x="242" y="80" width="16" height="75" rx="3" fill={color} stroke={shadowColor} strokeWidth="1.2" />
                <circle cx="250" cy="95" r="2.5" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                <circle cx="250" cy="120" r="2.5" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                <circle cx="250" cy="145" r="2.5" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
              </g>
            ) : (
              /* Hoodie Hood Overlay & Pocket */
              <g>
                {/* Architectural Cross Hood */}
                <path
                  d="M 175 40 C 210 20, 290 20, 325 40 C 310 95, 190 95, 175 40 Z"
                  fill="#000000"
                  fillOpacity="0.2"
                />
                <path
                  d="M 175 40 C 220 85, 280 85, 325 40"
                  stroke={shadowColor}
                  strokeWidth="3"
                />
                {/* Hoodie Kangaroo Pocket */}
                <path
                  d="M 180 430 L 320 430 L 340 480 L 340 540 L 160 540 L 160 480 Z"
                  fill={color}
                  stroke={shadowColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 180 430 L 320 430"
                  stroke="#ffffff"
                  strokeOpacity="0.2"
                  strokeWidth="1.5"
                />
              </g>
            )
          ) : (
            /* Back View Collar */
            <g>
              <path
                d="M 170 50 C 205 62, 295 62, 330 50"
                stroke={shadowColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 172 52 C 205 60, 295 60, 328 52"
                stroke="#ffffff"
                strokeOpacity="0.2"
                strokeWidth="1.5"
              />
              {/* Back yoke seam */}
              <line x1="165" y1="105" x2="335" y2="105" stroke="#000000" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>
          )}

          {/* Hem Bottom Double Stitching Line */}
          <line
            x1="138"
            y1="545"
            x2="362"
            y2="545"
            stroke="#000000"
            strokeOpacity="0.12"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <line
            x1="138"
            y1="548"
            x2="362"
            y2="548"
            stroke="#ffffff"
            strokeOpacity="0.15"
            strokeWidth="1.2"
          />

          {/* Sleeve Hem Stitching */}
          <line x1="68" y1="135" x2="105" y2="235" stroke="#000000" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="432" y1="135" x2="395" y2="235" stroke="#000000" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* Printable Area Visual Guide (160x240 box at center) */}
        {showPrintAreaGuide && (
          <g className="transition-all duration-300">
            <rect
              x="165"
              y="130"
              width="170"
              height="260"
              rx="4"
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              strokeOpacity="0.75"
            />
            {/* Corner tags for print boundary */}
            <path d="M 165 140 L 165 130 L 175 130" stroke="#4f46e5" strokeWidth="2" fill="none" />
            <path d="M 325 130 L 335 130 L 335 140" stroke="#4f46e5" strokeWidth="2" fill="none" />
            <path d="M 165 380 L 165 390 L 175 390" stroke="#4f46e5" strokeWidth="2" fill="none" />
            <path d="M 325 390 L 335 390 L 335 380" stroke="#4f46e5" strokeWidth="2" fill="none" />
            {/* Quiet print area label */}
            <text
              x="250"
              y="124"
              fill="#6366f1"
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="600"
              letterSpacing="1"
              textAnchor="middle"
              opacity="0.8"
            >
              MAX PRINT BOUNDARY (35 × 45 CM)
            </text>
          </g>
        )}
      </svg>
    );
  }

  // Left or Right Sleeve View
  const isLeft = view === 'leftSleeve';
  return (
    <svg
      viewBox="0 0 500 600"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`sleeve-shading-${view}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Sleeve Geometry */}
      <g>
        {/* Armhole seam on left or right, cuff at bottom */}
        <path
          d={
            isLeft
              ? 'M 180 80 C 230 70, 320 80, 340 120 L 310 460 C 290 480, 210 480, 190 460 L 160 120 Z'
              : 'M 160 120 C 180 80, 270 70, 320 80 L 340 120 L 310 460 C 290 480, 210 480, 190 460 Z'
          }
          fill={color}
          stroke={shadowColor}
          strokeWidth="1.5"
        />
        <path
          d={
            isLeft
              ? 'M 180 80 C 230 70, 320 80, 340 120 L 310 460 C 290 480, 210 480, 190 460 L 160 120 Z'
              : 'M 160 120 C 180 80, 270 70, 320 80 L 340 120 L 310 460 C 290 480, 210 480, 190 460 Z'
          }
          fill={`url(#sleeve-shading-${view})`}
        />
        {/* Sleeve Cuff Stitching */}
        <line x1="192" y1="448" x2="308" y2="448" stroke="#000000" strokeOpacity="0.15" strokeWidth="1.2" strokeDasharray="3 2" />
        <line x1="192" y1="452" x2="308" y2="452" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1.2" />

        {/* Sleeve print area guide */}
        {showPrintAreaGuide && (
          <g>
            <rect
              x="200"
              y="180"
              width="100"
              height="180"
              rx="4"
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              strokeOpacity="0.8"
            />
            <text
              x="250"
              y="172"
              fill="#6366f1"
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="600"
              textAnchor="middle"
              opacity="0.8"
            >
              SLEEVE PRINT (10 × 20 CM)
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
