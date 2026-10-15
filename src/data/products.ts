import { GarmentColor, GarmentOption, Product } from '../types';
import heroModel from '../assets/images/hero_tshirt_model_1790842788610.jpg';
import blackHeavyweight from '../assets/images/product_black_heavyweight_1790842803976.jpg';
import washedGrey from '../assets/images/product_washed_grey_1790842827172.jpg';
import whiteClassic from '../assets/images/product_white_classic_1790842841138.jpg';
import hoodieSand from '../assets/images/category_hoodie_sand_1790842857534.jpg';
import mugsCups from '../assets/images/jr_mugs_cups_1791138662002.jpg';
import pillows from '../assets/images/jr_pillows_1791138677099.jpg';
import photoFrames from '../assets/images/jr_photo_frames_1791138694543.jpg';
import bottlesGifts from '../assets/images/jr_bottles_gifts_1791138712559.jpg';

export const GARMENT_OPTIONS: GarmentOption[] = [
  {
    id: 'heavyweight-tee',
    name: 'Heavyweight Studio Tee',
    subtitle: '280 GSM Premium Combed Cotton',
    basePrice: 999,
    weightGsm: 280,
    material: '100% Combed Ring-Spun Cotton',
    fit: 'Relaxed Streetwear Fit',
  },
  {
    id: 'oversized-boxy',
    name: 'Oversized Boxy Tee',
    subtitle: '300 GSM Drop-Shoulder Silhouette',
    basePrice: 1299,
    weightGsm: 300,
    material: '100% Organic Vintage Washed Cotton',
    fit: 'Boxy Drop Shoulder',
  },
  {
    id: 'classic-crew',
    name: 'Essential Crewneck Tee',
    subtitle: '190 GSM Soft Lightweight Everyday',
    basePrice: 699,
    weightGsm: 190,
    material: '100% Supima Organic Cotton',
    fit: 'Standard Tailored Fit',
  },
  {
    id: 'french-terry-hoodie',
    name: 'French Terry Pullover Hoodie',
    subtitle: '450 GSM Heavy Architectural Fleece',
    basePrice: 2299,
    weightGsm: 450,
    material: '100% Looped French Terry Cotton',
    fit: 'Structured Oversized Fit',
  },
  {
    id: 'pique-polo',
    name: 'Heritage Piqué Polo',
    subtitle: '240 GSM Mercerized Piqué Knit',
    basePrice: 1399,
    weightGsm: 240,
    material: '100% Long-Staple Mercerized Cotton',
    fit: 'Classic Athletic Fit',
  },
];

export const GARMENT_COLORS: GarmentColor[] = [
  { name: 'Onyx Black', hex: '#171717', shadowHex: '#0a0a0a' },
  { name: 'Pure White', hex: '#FFFFFF', shadowHex: '#E5E5E5' },
  { name: 'Washed Charcoal', hex: '#374151', shadowHex: '#1F2937' },
  { name: 'Heather Grey', hex: '#9CA3AF', shadowHex: '#6B7280' },
  { name: 'Desert Sand', hex: '#D7C4A5', shadowHex: '#B8A17E' },
  { name: 'Midnight Navy', hex: '#1E293B', shadowHex: '#0F172A' },
  { name: 'Deep Forest', hex: '#14532D', shadowHex: '#052E16' },
  { name: 'Vintage Crimson', hex: '#881337', shadowHex: '#4C0519' },
  { name: 'Mustard Ochre', hex: '#D97706', shadowHex: '#92400E' },
  { name: 'Soft Rose', hex: '#F472B6', shadowHex: '#BE185D' },
];

export const SIZES = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
  '5XL',
  '6XL',
];

export interface SizeMeasurement {
  size: string;
  chestInches: string;
  chestCm: string;
  lengthInches: string;
  lengthCm: string;
  shoulderInches: string;
  sleeveInches: string;
}

export const SIZE_CHART_DATA: SizeMeasurement[] = [
  { size: 'XXS', chestInches: '32 - 34"', chestCm: '81 - 86 cm', lengthInches: '26.0"', lengthCm: '66 cm', shoulderInches: '16.0"', sleeveInches: '7.5"' },
  { size: 'XS', chestInches: '34 - 36"', chestCm: '86 - 91 cm', lengthInches: '27.0"', lengthCm: '68 cm', shoulderInches: '17.0"', sleeveInches: '8.0"' },
  { size: 'S', chestInches: '38 - 40"', chestCm: '96 - 101 cm', lengthInches: '28.0"', lengthCm: '71 cm', shoulderInches: '18.0"', sleeveInches: '8.5"' },
  { size: 'M', chestInches: '40 - 42"', chestCm: '101 - 107 cm', lengthInches: '29.0"', lengthCm: '74 cm', shoulderInches: '19.0"', sleeveInches: '9.0"' },
  { size: 'L', chestInches: '42 - 44"', chestCm: '107 - 112 cm', lengthInches: '30.0"', lengthCm: '76 cm', shoulderInches: '20.0"', sleeveInches: '9.5"' },
  { size: 'XL', chestInches: '44 - 46"', chestCm: '112 - 117 cm', lengthInches: '31.0"', lengthCm: '79 cm', shoulderInches: '21.0"', sleeveInches: '10.0"' },
  { size: '2XL', chestInches: '48 - 50"', chestCm: '122 - 127 cm', lengthInches: '32.0"', lengthCm: '81 cm', shoulderInches: '22.0"', sleeveInches: '10.5"' },
  { size: '3XL', chestInches: '52 - 54"', chestCm: '132 - 137 cm', lengthInches: '33.0"', lengthCm: '84 cm', shoulderInches: '23.0"', sleeveInches: '11.0"' },
  { size: '4XL', chestInches: '56 - 58"', chestCm: '142 - 147 cm', lengthInches: '33.5"', lengthCm: '85 cm', shoulderInches: '24.0"', sleeveInches: '11.5"' },
  { size: '5XL', chestInches: '60 - 62"', chestCm: '152 - 157 cm', lengthInches: '34.0"', lengthCm: '86 cm', shoulderInches: '25.0"', sleeveInches: '12.0"' },
  { size: '6XL', chestInches: '64 - 66"', chestCm: '162 - 168 cm', lengthInches: '34.5"', lengthCm: '88 cm', shoulderInches: '26.0"', sleeveInches: '12.5"' },
];

// Product images generated via studio prompts
export const PRODUCT_IMAGES = {
  heroModel,
  blackHeavyweight,
  washedGrey,
  whiteClassic,
  hoodieSand,
  mugsCups,
  pillows,
  photoFrames,
  bottlesGifts,
};

// JR PRINTING WORKS Official Business & Banner Profile
export const JR_INFO = {
  shopName: 'JR PRINTING WORKS',
  tagline: 'Custom Photo & Gift Printing Studio',
  proprietor: 'Pro. Shaikh Sameer',
  phone1: '7888162822',
  phone2: '7888162824',
  phone1Formatted: '+91 7888162822',
  phone2Formatted: '+91 7888162824',
  whatsapp1Link: 'https://wa.me/917888162822?text=Hello%20JR%20Printing%20Works%2C%20I%20want%20to%20order%20custom%20printing',
  whatsapp2Link: 'https://wa.me/917888162824?text=Hello%20Pro.%20Shaikh%20Sameer%2C%20I%20want%20to%20order%20custom%20printing',
  services: [
    'T Shirt Printing',
    'Cup Printing',
    'Pillow Printing',
    'Bottle Printing',
    'Key Chain Printing',
    'Photo Frame Printing',
    'Mobile Back Cover Printing',
  ],
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-heavyweight-black',
    name: 'Atelier Heavyweight 280GSM Tee',
    tagline: 'The ultimate heavyweight cotton blank engineered for high-density DTG printing.',
    description: 'Constructed from sustainably sourced 280 GSM combed cotton. Pre-shrunk with side-seamed construction, double-needle neck ribbing, and reinforced shoulder taping to maintain structured drape wash after wash.',
    category: 'custom',
    basePrice: 999,
    originalPrice: 1399,
    discountPercent: 28,
    images: [
      PRODUCT_IMAGES.blackHeavyweight,
      PRODUCT_IMAGES.washedGrey,
      PRODUCT_IMAGES.heroModel,
    ],
    colors: GARMENT_COLORS.slice(0, 6),
    sizes: [...SIZES],
    material: '100% Combed Ring-Spun Cotton',
    weightGsm: 280,
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    garmentType: 'heavyweight-tee',
    isBestSeller: true,
    features: [
      'Zero-twist 280 GSM luxury combed jersey',
      'Ultra-dense micro-weave optimized for digital direct-to-garment ink fidelity',
      'Blind stitch hems and high-durability 1x1 ribbed collar',
      'Pre-washed and enzyme-treated for zero shrinkage and ultra-soft hand feel',
    ],
  },
  {
    id: 'prod-oversized-charcoal',
    name: 'Vintage Washed Boxy Tee',
    tagline: 'Modern streetwear cut with dropped shoulders and relaxed torso drape.',
    description: 'An architectural streetwear silhouette engineered in 300 GSM vintage garment-dyed cotton. Featuring deep dropped armholes and a thick 30mm collar band.',
    category: 'oversized',
    basePrice: 1299,
    originalPrice: 1699,
    discountPercent: 23,
    images: [
      PRODUCT_IMAGES.washedGrey,
      PRODUCT_IMAGES.blackHeavyweight,
      PRODUCT_IMAGES.heroModel,
    ],
    colors: [
      GARMENT_COLORS[2], // Washed Charcoal
      GARMENT_COLORS[0], // Onyx
      GARMENT_COLORS[4], // Desert Sand
      GARMENT_COLORS[3], // Heather Grey
    ],
    sizes: [...SIZES],
    material: '100% Organic Vintage-Dyed Cotton',
    weightGsm: 300,
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    garmentType: 'oversized-boxy',
    isNewArrival: true,
    features: [
      'Boxy drop-shoulder cut with modern wider sleeves',
      'Custom garment wash delivering subtle stone-fade patina',
      'Reinforced shoulder seam lines and 30mm ribbed neck band',
      'Compatible with full-bleed front and back custom prints',
    ],
  },
  {
    id: 'prod-essential-white',
    name: 'Supima Organic Classic Crew',
    tagline: 'Pure, crisp everyday luxury tee with breathable all-day comfort.',
    description: 'Spun from extra-long staple Supima cotton for an exceptionally silky feel and brilliant color retention. The essential wardrobe foundational tee.',
    category: 'men',
    basePrice: 699,
    originalPrice: 999,
    discountPercent: 30,
    images: [
      PRODUCT_IMAGES.whiteClassic,
      PRODUCT_IMAGES.blackHeavyweight,
      PRODUCT_IMAGES.heroModel,
    ],
    colors: [
      GARMENT_COLORS[1], // Pure White
      GARMENT_COLORS[0], // Onyx Black
      GARMENT_COLORS[3], // Heather Grey
      GARMENT_COLORS[5], // Navy
    ],
    sizes: [...SIZES],
    material: '100% Supima Organic Cotton',
    weightGsm: 190,
    rating: 4.9,
    reviewCount: 215,
    inStock: true,
    garmentType: 'classic-crew',
    isBestSeller: true,
    features: [
      'Extra-long staple Supima cotton fibers resist pilling',
      'Featherlight yet opaque 190 GSM breathable structure',
      'Tailored European cut that flatters without clinging',
      'Environmentally certified non-toxic reactive dyes',
    ],
  },
  {
    id: 'prod-french-terry-hoodie',
    name: 'French Terry Studio Hoodie',
    tagline: '450 GSM architectural heavyweight fleece with double-layer hood.',
    description: 'A masterpiece of casual tailoring. Unbrushed loopback French terry offers exceptional warmth and breathability without bulk. Clean kangaroo pocket and seamless cuffs.',
    category: 'hoodies',
    basePrice: 2299,
    originalPrice: 2999,
    discountPercent: 23,
    images: [
      PRODUCT_IMAGES.hoodieSand,
      PRODUCT_IMAGES.blackHeavyweight,
      PRODUCT_IMAGES.washedGrey,
    ],
    colors: [
      GARMENT_COLORS[4], // Desert Sand
      GARMENT_COLORS[0], // Onyx
      GARMENT_COLORS[2], // Charcoal
      GARMENT_COLORS[5], // Navy
      GARMENT_COLORS[6], // Forest
    ],
    sizes: [...SIZES],
    material: '100% Loopback French Terry Cotton',
    weightGsm: 450,
    rating: 5.0,
    reviewCount: 76,
    inStock: true,
    garmentType: 'french-terry-hoodie',
    isNewArrival: true,
    features: [
      'Substantial 450 GSM unbrushed loopback interior',
      'Double-layer hood that stands upright without drawstrings',
      'Concealed bar-tacked side pockets and flatlock stitching',
      'Superior chest, back, and sleeve print areas for custom branding',
    ],
  },
  {
    id: 'prod-womens-crop-tee',
    name: 'Relaxed Fit Women’s Tee',
    tagline: 'Flattering relaxed drape crafted with premium ring-spun cotton.',
    description: 'Designed specifically with a relaxed shoulder slope and comfortable sleeve length. Perfectly balanced for casual everyday wear or custom graphic prints.',
    category: 'women',
    basePrice: 799,
    originalPrice: 1099,
    discountPercent: 27,
    images: [
      PRODUCT_IMAGES.whiteClassic,
      PRODUCT_IMAGES.heroModel,
      PRODUCT_IMAGES.blackHeavyweight,
    ],
    colors: [
      GARMENT_COLORS[1], // White
      GARMENT_COLORS[0], // Black
      GARMENT_COLORS[9], // Soft Rose
      GARMENT_COLORS[4], // Desert Sand
    ],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    material: '100% Organic Ring-Spun Cotton',
    weightGsm: 210,
    rating: 4.8,
    reviewCount: 64,
    inStock: true,
    garmentType: 'classic-crew',
    features: [
      'Tailored feminine neckline with fine ribbing',
      'Soft enzyme-wash finish for gentle skin feel',
      'Side-seamed construction ensures silhouette retention',
      'Certified OEKO-TEX Standard 100 safe textiles',
    ],
  },
  {
    id: 'prod-kids-organic-tee',
    name: 'Junior Soft Organic Tee',
    tagline: 'Hypoallergenic organic cotton tee built for active play and easy washing.',
    description: 'Created with extra-soft organic combed cotton. Chemical-free, tagless neck label, and durable double-stitch seams made to endure daily adventures.',
    category: 'kids',
    basePrice: 599,
    originalPrice: 799,
    discountPercent: 25,
    images: [
      PRODUCT_IMAGES.whiteClassic,
      PRODUCT_IMAGES.washedGrey,
    ],
    colors: [
      GARMENT_COLORS[1], // White
      GARMENT_COLORS[5], // Navy
      GARMENT_COLORS[8], // Mustard
      GARMENT_COLORS[7], // Crimson
    ],
    sizes: ['2-3Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    material: '100% GOTS-Certified Organic Cotton',
    weightGsm: 180,
    rating: 4.9,
    reviewCount: 52,
    inStock: true,
    garmentType: 'classic-crew',
    features: [
      '100% GOTS organic cotton with water-based dyes',
      'Tagless heat-transferred inner label prevents scratching',
      'Reinforced neckband holds shape after repeated washing',
      'Safe for sensitive skin and infant wear',
    ],
  },
  // JR PRINTING WORKS BANNER PRODUCTS
  {
    id: 'jr-custom-cup-collage',
    name: 'JR Custom Ceramic Photo Collage Mug',
    tagline: 'High-gloss AAA grade ceramic mug with multi-photo collage sublimation print.',
    description: 'Personalized coffee mug printed with vibrant 300 DPI sublimation inks. Microwave and dishwasher safe with brilliant gloss coating. Perfect for birthdays, anniversaries, and family memories.',
    category: 'cups',
    basePrice: 249,
    originalPrice: 399,
    discountPercent: 38,
    images: [
      PRODUCT_IMAGES.mugsCups,
      PRODUCT_IMAGES.whiteClassic,
    ],
    colors: [
      { name: 'Gloss White', hex: '#FFFFFF', shadowHex: '#E5E5E5' },
      { name: 'Matte Black', hex: '#171717', shadowHex: '#0A0A0A' },
      { name: 'Crimson Red', hex: '#881337', shadowHex: '#4C0519' },
    ],
    sizes: ['11 oz (325 ml)', '15 oz (450 ml)'],
    material: 'Premium Grade AAA Ceramic',
    weightGsm: 350,
    rating: 5.0,
    reviewCount: 184,
    inStock: true,
    garmentType: 'ceramic-cup',
    isBestSeller: true,
    features: [
      '11 oz & 15 oz capacity with comfortable C-handle grip',
      'Ultra-sharp photo collage sublimation with scratch-resistant coating',
      '100% Microwave and Dishwasher safe heat-cured glaze',
      'Shipped in protective thermocol safety packaging',
    ],
  },
  {
    id: 'jr-magic-color-mug',
    name: 'JR Magic Heat-Sensitive Photo Reveal Mug',
    tagline: 'Pour hot beverage to magically reveal your hidden family portrait photo!',
    description: 'Black ceramic mug that looks mysteriously plain when cool, but instantly turns translucent white when filled with hot coffee or tea, revealing your personalized high-definition photo.',
    category: 'cups',
    basePrice: 399,
    originalPrice: 599,
    discountPercent: 33,
    images: [
      PRODUCT_IMAGES.mugsCups,
    ],
    colors: [
      { name: 'Magic Black', hex: '#171717', shadowHex: '#000000' },
      { name: 'Magic Navy', hex: '#1E293B', shadowHex: '#0F172A' },
      { name: 'Magic Crimson', hex: '#881337', shadowHex: '#4C0519' },
    ],
    sizes: ['11 oz Standard'],
    material: 'Thermochromic Coated Ceramic',
    weightGsm: 360,
    rating: 4.9,
    reviewCount: 220,
    inStock: true,
    garmentType: 'ceramic-cup',
    isBestSeller: true,
    features: [
      'Dramatic heat-activated color-change reveal effect',
      'Conceals photo completely when cold / empty',
      'High-resolution non-fade polymer transfer',
      'The #1 gift choice for birthdays and surprises',
    ],
  },
  {
    id: 'jr-velvet-photo-cushion',
    name: 'JR Luxury Velvet Square Photo Pillow',
    tagline: 'Plush velvet cushion with vivid edge-to-edge photo printing and filler.',
    description: 'Silky smooth velvet photo pillow crafted with high-density conjugate microfiber filling. Features concealed zipper for easy washing and lifelong color retention.',
    category: 'pillows',
    basePrice: 499,
    originalPrice: 699,
    discountPercent: 29,
    images: [
      PRODUCT_IMAGES.pillows,
    ],
    colors: [
      { name: 'Ruby Crimson Red', hex: '#881337', shadowHex: '#4C0519' },
      { name: 'Royal Navy', hex: '#1E293B', shadowHex: '#0F172A' },
      { name: 'Golden Mustard', hex: '#D97706', shadowHex: '#92400E' },
    ],
    sizes: ['12×12 Inch', '16×16 Inch', '18×18 Inch'],
    material: 'Premium Plush Micro-Velvet with Conjugate Fiber',
    weightGsm: 400,
    rating: 4.8,
    reviewCount: 96,
    inStock: true,
    garmentType: 'photo-pillow',
    isNewArrival: true,
    features: [
      'Ultra-soft touch velvet fabric with feather-soft interior cushion filler',
      'Hidden side zipper enclosure for effortless machine washing',
      'Digital direct thermal print that will never peel or crack',
      'Custom text and photo arrangement on front panel',
    ],
  },
  {
    id: 'jr-magic-sequin-pillow',
    name: 'JR Magic Reversible Sequin Swipe Pillow',
    tagline: 'Swipe your hand across the sparkling sequins to reveal your photo!',
    description: 'Dual-faced reversible sequins that flip effortlessly with a simple brush of your hand. One side shines in rich metallic sparkle; swipe up to reveal your printed memory.',
    category: 'pillows',
    basePrice: 599,
    originalPrice: 899,
    discountPercent: 33,
    images: [
      PRODUCT_IMAGES.pillows,
    ],
    colors: [
      { name: 'Red & Silver Sequin', hex: '#991B1B', shadowHex: '#7F1D1D' },
      { name: 'Gold & Black Sequin', hex: '#CA8A04', shadowHex: '#854D0E' },
      { name: 'Blue & Silver Sequin', hex: '#1D4ED8', shadowHex: '#1E40AF' },
    ],
    sizes: ['16×16 Inch Square', 'Heart Shape 16 Inch'],
    material: 'High-Density Reversible Sequins with Satin Backing',
    weightGsm: 450,
    rating: 5.0,
    reviewCount: 145,
    inStock: true,
    garmentType: 'photo-pillow',
    isBestSeller: true,
    features: [
      'Interactive 2-in-1 swipeable flip sequins',
      'Back side made of ultra-comfortable satin silk',
      'Includes plump vacuum-sealed cushion pad',
      'Fascinating tactile gift for children and loved ones',
    ],
  },
  {
    id: 'jr-sports-sipper-bottle',
    name: 'JR Aluminum Photo Sports Sipper Bottle',
    tagline: '750ml lightweight leakproof sports bottle with 360° cylindrical photo print.',
    description: 'Durable food-grade aluminum sipper bottle featuring secure screw carabiner cap. Engineered for gym, school, sports, and daily travel with vibrant personalized graphics.',
    category: 'bottles',
    basePrice: 449,
    originalPrice: 649,
    discountPercent: 31,
    images: [
      PRODUCT_IMAGES.bottlesGifts,
    ],
    colors: [
      { name: 'Gloss White', hex: '#FFFFFF', shadowHex: '#E5E5E5' },
      { name: 'Metallic Silver', hex: '#9CA3AF', shadowHex: '#6B7280' },
    ],
    sizes: ['600 ml', '750 ml'],
    material: 'BPA-Free Food-Grade Aluminum with Carabiner Hook',
    weightGsm: 220,
    rating: 4.9,
    reviewCount: 112,
    inStock: true,
    garmentType: 'sipper-bottle',
    features: [
      'Lightweight shatterproof aluminum with leak-resistant cap',
      'Convenient climbing clip carabiner hook for backpacks',
      'BPA-free non-toxic interior liner keeps liquids fresh',
      'Scratch-resistant baked enamel graphic finish',
    ],
  },
  {
    id: 'jr-wooden-collage-frame',
    name: 'JR Custom Wooden Wall Collage Photo Frame',
    tagline: 'Personalized multi-window family collage frame with 3D laser-cut name lettering.',
    description: 'Crafted from 8mm engineered MDF wood with precision laser-cut romantic heart and name accents (like "Shivansh ❤ Shanaya"). Holds multiple photo prints protected by crystal-clear acrylic sheets.',
    category: 'frames',
    basePrice: 749,
    originalPrice: 1199,
    discountPercent: 38,
    images: [
      PRODUCT_IMAGES.photoFrames,
    ],
    colors: [
      { name: 'Matte Ebony Black', hex: '#1C1917', shadowHex: '#0C0A09' },
      { name: 'Walnut Wood', hex: '#78350F', shadowHex: '#451A03' },
      { name: 'Vintage White', hex: '#F5F5F4', shadowHex: '#E7E5E4' },
    ],
    sizes: ['12×18 Inch (7 Photos)', '18×24 Inch (11 Photos)'],
    material: 'High-Density Laser-Cut MDF Wood with Acrylic Guard',
    weightGsm: 850,
    rating: 5.0,
    reviewCount: 310,
    inStock: true,
    garmentType: 'photo-frame',
    isBestSeller: true,
    features: [
      'Multi-opening layout customized with your couple/family photos',
      'Custom 3D laser name engraving with romantic heart emblem',
      'Supplied ready-to-hang with sturdy brass wall brackets',
      'Shatterproof high-transparency protective face',
    ],
  },
  {
    id: 'jr-photo-keychains-pack',
    name: 'JR Custom Acrylic & Metal Photo Key Chains',
    tagline: 'Pocket-sized memories: crystal clear acrylic & round metallic photo keychains.',
    description: 'Keep your favorite portraits close wherever you go. Double-sided high-definition photo print sealed under crystal resin and robust nickel key rings.',
    category: 'keychains',
    basePrice: 149,
    originalPrice: 249,
    discountPercent: 40,
    images: [
      PRODUCT_IMAGES.bottlesGifts,
    ],
    colors: [
      { name: 'Crystal Clear', hex: '#F8FAFC', shadowHex: '#CBD5E1' },
      { name: 'Polished Chrome', hex: '#94A3B8', shadowHex: '#64748B' },
    ],
    sizes: ['Round 45mm', 'Rectangle 35×50mm', 'Heart Shape'],
    material: 'Optical Cast Acrylic & Nickel-Plated Steel',
    weightGsm: 40,
    rating: 4.8,
    reviewCount: 88,
    inStock: true,
    garmentType: 'keychain',
    features: [
      'Double-sided photo insert showing 2 different photos',
      'Heavy-duty split ring resists bending and daily wear',
      'Waterproof sealed capsule keeps pictures bright and sharp',
      'Perfect bulk return gift for weddings and celebrations',
    ],
  },
  {
    id: 'jr-mobile-back-cover',
    name: 'JR Custom HD Printed Mobile Back Cover',
    tagline: 'Personalized smartphone case with edge-to-edge glossy photo printing.',
    description: 'Available for all iPhone, Samsung, OnePlus, Vivo, Oppo, Realme, and Xiaomi models. Polycarbonate slim hard case with precision camera and button cutouts.',
    category: 'mobile-covers',
    basePrice: 299,
    originalPrice: 499,
    discountPercent: 40,
    images: [
      PRODUCT_IMAGES.bottlesGifts,
    ],
    colors: [
      { name: 'Gloss Hard Polycarbonate', hex: '#0F172A', shadowHex: '#020617' },
      { name: 'Shockproof TPU Soft', hex: '#334155', shadowHex: '#1E293B' },
    ],
    sizes: ['All iPhone Models', 'All Samsung Models', 'All OnePlus / Vivo / Oppo / Xiaomi'],
    material: 'Impact-Resistant Polycarbonate Shell',
    weightGsm: 60,
    rating: 4.9,
    reviewCount: 204,
    inStock: true,
    garmentType: 'mobile-case',
    isBestSeller: true,
    features: [
      'Edge-to-edge embedded sublimation print (no peeling or fading)',
      'Slim ergonomic profile with raised bezels to guard camera lens',
      'Precise speaker, port, and wireless charging pass-through',
      'Upload any photo, artwork, or name collage in custom studio',
    ],
  },
];
