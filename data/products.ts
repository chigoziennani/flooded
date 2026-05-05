import type { ImageSourcePropType } from 'react-native';

export type StockState = 'in_stock' | 'low' | 'out';
export type ProductCondition = 'new' | 'used';

export type SizeRow = {
  size: string;
  /** For tops */
  chest?: string;
  bodyLength?: string;
  sleeve?: string;
  /** For bottoms */
  waist?: string;
  inseam?: string;
  hip?: string;
  /** For shoes */
  eu?: string;
  uk?: string;
  lengthMm?: string;
};

export type Product = {
  id: string;
  brand: string;
  name: string;
  price: number;
  /** Sale price — when set, the product is on sale */
  salePrice?: number;
  image: ImageSourcePropType;
  inseamMin: number;
  inseamMax: number;
  tallTorsoFriendly: boolean;
  category: string;
  sizes: string[];
  condition: ProductCondition;
  colorway: string;
  /** One-line style summary */
  style: string;
  /** Full product description (2–3 sentences) */
  description: string;
  /** Fabric/material composition */
  materials: string;
  /** Fit guidance for tall bodies */
  fit: string;
  /** Sizing table rows */
  sizeChart: SizeRow[];
  /** Product IDs of complementary items to pair with */
  pairs: string[];
};

export const PRODUCTS: Product[] = [
  // ── TOPS ──────────────────────────────────────────────────────────────────
  {
    pairs: ['p5', 'p7', 'p10'],
    id: 'p1',
    brand: 'Fear of God',
    name: 'Essentials Hoodie — Tall',
    price: 148,
    image: require('../assets/images/essentials-hoodie.png'),
    inseamMin: 32,
    inseamMax: 40,
    tallTorsoFriendly: true,
    category: 'Tops',
    sizes: ['MT', 'LT', 'XLT', 'XXLT'],
    condition: 'new',
    colorway: 'Desert / Taupe',
    style: 'Oversized fleece hoodie with dropped shoulders and extended body.',
    description:
      'The Essentials Hoodie Tall is cut 2.5" longer through the body and arms than the standard cut — eliminating the riding-up problem on long torsos. Double-layer hood, ribbed hem, and a forward seam give it the signature FoG silhouette without sacrificing coverage.',
    materials: '80% cotton, 20% polyester — heavyweight 450gsm French terry fleece.',
    fit: 'Oversized through the chest and shoulders. Tall sizing adds length at the hem and cuffs — size down if you prefer a closer fit.',
    sizeChart: [
      { size: 'MT',   chest: '42–44"', bodyLength: '28"', sleeve: '35"' },
      { size: 'LT',   chest: '44–46"', bodyLength: '30"', sleeve: '36"' },
      { size: 'XLT',  chest: '48–50"', bodyLength: '31"', sleeve: '37"' },
      { size: 'XXLT', chest: '52–54"', bodyLength: '32"', sleeve: '38"' },
    ],
  },
  {
    pairs: ['p6', 'p8', 'p11'],
    id: 'p2',
    brand: 'Stüssy',
    name: 'Stock Logo Crewneck — Long',
    price: 118,
    image: require('../assets/images/stussy-crewneck.png'),
    inseamMin: 30,
    inseamMax: 38,
    tallTorsoFriendly: true,
    category: 'Tops',
    sizes: ['LT', 'XLT', 'XXLT'],
    condition: 'new',
    colorway: 'Natural White',
    style: 'Heavyweight French terry crewneck with tall-extended torso and sleeves.',
    description:
      'Stüssy\'s classic Stock Logo Crewneck rebuilt for tall proportions. The extended body length (30–32") keeps the hem at the hip rather than riding up, and the reinforced cuffs maintain structure through the sleeve. Chest embroidery stays centered on a taller frame.',
    materials: '70% cotton, 30% polyester — 350gsm heavyweight terry.',
    fit: 'Relaxed through the body; true to width. Tall sizing adds 2–3" in body length vs. standard. Fits best on 6\'1"+ frames.',
    sizeChart: [
      { size: 'LT',   chest: '42–44"', bodyLength: '30"', sleeve: '36"' },
      { size: 'XLT',  chest: '46–48"', bodyLength: '31"', sleeve: '37"' },
      { size: 'XXLT', chest: '50–52"', bodyLength: '32"', sleeve: '38"' },
    ],
  },
  {
    pairs: ['p5', 'p8', 'p9'],
    id: 'p3',
    brand: 'Carhartt WIP',
    name: 'Chase L/S Tee',
    price: 65,
    salePrice: 49,
    image: require('../assets/images/carhartt-chase-ls.png'),
    inseamMin: 32,
    inseamMax: 40,
    tallTorsoFriendly: true,
    category: 'Tops',
    sizes: ['MT', 'LT', 'XLT'],
    condition: 'new',
    colorway: 'Wax / Gold',
    style: 'Relaxed single jersey long-sleeve with extra body and arm length.',
    description:
      'Carhartt WIP\'s Chase silhouette in a tall-specific long-sleeve cut. Single jersey construction drapes cleanly without clinging. The extra 1.5" in body length and sleeve keeps everything in proportion on frames over 6\'2".',
    materials: '100% combed cotton — 180gsm single jersey.',
    fit: 'Relaxed body, slightly boxy. Runs true to size in width. Tall sizing corrects the short-torso problem common in standard long-sleeves.',
    sizeChart: [
      { size: 'MT',  chest: '40–42"', bodyLength: '29"', sleeve: '35"' },
      { size: 'LT',  chest: '42–44"', bodyLength: '30.5"', sleeve: '36.5"' },
      { size: 'XLT', chest: '46–48"', bodyLength: '32"', sleeve: '37.5"' },
    ],
  },
  {
    pairs: ['p7', 'p11'],
    id: 'p4',
    brand: 'Champion',
    name: 'Reverse Weave Crew — XL Tall',
    price: 72,
    salePrice: 55,
    image: require('../assets/images/champion-reverse.png'),
    inseamMin: 30,
    inseamMax: 38,
    tallTorsoFriendly: true,
    category: 'Tops',
    sizes: ['LT', 'XLT', 'XXLT'],
    condition: 'new',
    colorway: 'Oxford Gray',
    style: 'Vertical-knit sweatshirt with side gussets — resists vertical shrinkage.',
    description:
      'Champion\'s Reverse Weave technology turns the fleece 90° to resist vertical shrinkage over time — the tall body stays long wash after wash. Ribbed side gussets allow unrestricted movement and maintain the boxy shape. A staple wardrobe piece built to stay in proportion.',
    materials: '82% cotton, 18% polyester — midweight 320gsm fleece.',
    fit: 'Classic boxy fit. Tall sizing adds length without increasing width — ideal for narrow-shoulder tall frames.',
    sizeChart: [
      { size: 'LT',   chest: '43–45"', bodyLength: '30"', sleeve: '36"' },
      { size: 'XLT',  chest: '47–49"', bodyLength: '31"', sleeve: '37"' },
      { size: 'XXLT', chest: '51–53"', bodyLength: '32"', sleeve: '38"' },
    ],
  },

  // ── BOTTOMS ───────────────────────────────────────────────────────────────
  {
    pairs: ['p1', 'p3', 'p9'],
    id: 'p5',
    brand: 'Carhartt WIP',
    name: 'Regular Cargo Pant',
    price: 130,
    image: require('../assets/images/carhartt-cargo-pant.png'),
    inseamMin: 34,
    inseamMax: 38,
    tallTorsoFriendly: false,
    category: 'Bottoms',
    sizes: ['30x34', '32x34', '34x34', '30x36', '32x36', '34x36'],
    condition: 'new',
    colorway: 'Dusty Hamilton Brown',
    style: 'Relaxed-fit ripstop cargo with 34" or 36" inseam options.',
    description:
      'Carhartt WIP\'s Regular Cargo is cut in a relaxed, straight leg with room through the seat and thigh. Available in both 34" and 36" inseam — one of the few cargo pants that genuinely accommodates tall proportions. Two thigh cargo pockets with snap closure. Hammered metal hardware.',
    materials: '100% cotton ripstop — 240gsm twill weave, enzyme washed for softness.',
    fit: 'Relaxed through the hip and thigh, straight leg opening. Waist measured at the natural waist — size up 1 if between sizes. Inseam runs true.',
    sizeChart: [
      { size: '30x34', waist: '30"', inseam: '34"', hip: '42"' },
      { size: '32x34', waist: '32"', inseam: '34"', hip: '44"' },
      { size: '34x34', waist: '34"', inseam: '34"', hip: '46"' },
      { size: '30x36', waist: '30"', inseam: '36"', hip: '42"' },
      { size: '32x36', waist: '32"', inseam: '36"', hip: '44"' },
      { size: '34x36', waist: '34"', inseam: '36"', hip: '46"' },
    ],
  },
  {
    pairs: ['p2', 'p11', 'p12'],
    id: 'p6',
    brand: 'Nike',
    name: 'Tech Fleece Jogger — Tall',
    price: 120,
    image: require('../assets/images/nike-tech-jogger.png'),
    inseamMin: 33,
    inseamMax: 39,
    tallTorsoFriendly: false,
    category: 'Bottoms',
    sizes: ['LT', 'XLT', 'XXLT'],
    condition: 'new',
    colorway: 'Black / Dark Smoke Gray',
    style: 'Tapered tech fleece with 34" inseam, articulated knees and side zips.',
    description:
      'Nike Tech Fleece Tall jogger cuts 2" longer in the inseam vs. the standard version. The engineered spacer fabric provides warmth without bulk, articulated knees follow your natural movement, and the ribbed cuffs with side-zip closures keep the silhouette clean at the ankle.',
    materials: 'Nike Tech Fleece — 56% cotton, 44% polyester spacer fabric.',
    fit: 'Tapered through the leg with a fitted seat. True to size in waist. If your inseam is 34"+ this is one of the only tech fleece joggers that hits the right length.',
    sizeChart: [
      { size: 'LT',   waist: '32–33"', inseam: '34"', hip: '44"' },
      { size: 'XLT',  waist: '34–36"', inseam: '34"', hip: '46"' },
      { size: 'XXLT', waist: '38–40"', inseam: '34"', hip: '50"' },
    ],
  },
  {
    pairs: ['p1', 'p4', 'p10'],
    id: 'p7',
    brand: 'ASOS Tall',
    name: 'Wide Leg Jean 36in',
    price: 69,
    salePrice: 52,
    image: require('../assets/images/asos-wide-leg.png'),
    inseamMin: 34,
    inseamMax: 38,
    tallTorsoFriendly: false,
    category: 'Bottoms',
    sizes: ['30x36', '32x36', '34x36', '36x36'],
    condition: 'new',
    colorway: 'Washed Indigo',
    style: 'Wide-leg 5-pocket denim with 36" inseam that sits low on the waist.',
    description:
      'ASOS Tall\'s wide leg jean is designed from the ground up for proportioned tall fit — the 36" inseam is a true 36", not a tagged 36". A mid-rise sits at the waist rather than the hip, and the wide leg opening (9.5") gives the right visual balance for longer legs.',
    materials: '98% cotton, 2% elastane — 12oz selvedge-style stretch denim.',
    fit: 'Wide leg from the knee down. Sits low on the waist. Runs true to size — no need to size up. Wash cold inside-out to preserve the indigo.',
    sizeChart: [
      { size: '30x36', waist: '30"', inseam: '36"', hip: '42"' },
      { size: '32x36', waist: '32"', inseam: '36"', hip: '44"' },
      { size: '34x36', waist: '34"', inseam: '36"', hip: '46"' },
      { size: '36x36', waist: '36"', inseam: '36"', hip: '48"' },
    ],
  },
  {
    pairs: ['p2', 'p3', 'p9'],
    id: 'p8',
    brand: 'Dickies Tall',
    name: '874 Work Pant — Extended',
    price: 58,
    image: require('../assets/images/dickies-tall.png'),
    inseamMin: 34,
    inseamMax: 40,
    tallTorsoFriendly: false,
    category: 'Bottoms',
    sizes: ['32x34', '34x34', '32x36', '34x36', '36x36'],
    condition: 'new',
    colorway: 'Black',
    style: 'Original fit work pant — no shrink, no fade. Tall inseam up to 40".',
    description:
      'The Dickies 874 is arguably the most-worn trouser in streetwear and workwear for 50 years. The tall cut extends the inseam to 36–38" without altering the vintage straight leg. Stain-release finish, non-iron, and machine washable. The black colorway pairs with everything.',
    materials: '65% polyester, 35% cotton — wrinkle-resistant twill, Stain-Release finish.',
    fit: 'Straight leg, sits at natural waist. Tall sizing extends the inseam only — width and seat remain standard. Size up 1 for a relaxed fit through the thigh.',
    sizeChart: [
      { size: '32x34', waist: '32"', inseam: '34"', hip: '43"' },
      { size: '34x34', waist: '34"', inseam: '34"', hip: '45"' },
      { size: '32x36', waist: '32"', inseam: '36"', hip: '43"' },
      { size: '34x36', waist: '34"', inseam: '36"', hip: '45"' },
      { size: '36x36', waist: '36"', inseam: '36"', hip: '47"' },
    ],
  },

  // ── SHOES ─────────────────────────────────────────────────────────────────
  {
    pairs: ['p5', 'p8', 'p3'],
    id: 'p9',
    brand: 'Nike',
    name: 'Dunk Low Retro',
    price: 115,
    image: require('../assets/images/nike-dunk-low-retro.png'),
    inseamMin: 30,
    inseamMax: 42,
    tallTorsoFriendly: false,
    category: 'Shoes',
    sizes: ['11', '12', '13', '14', '15'],
    condition: 'new',
    colorway: 'White / Gym Red / Black',
    style: 'OG low-profile basketball silhouette — padded collar, foam midsole.',
    description:
      'The Nike Dunk Low Retro brings back the original 1985 basketball silhouette in its cleanest form. Split leather upper, perforated toe box, pivot point rubber outsole. Tall sizing goes up to US 15 — no more sold-out frustration at the top end.',
    materials: 'Full-grain leather upper, foam midsole, rubber cupsole outsole.',
    fit: 'True to size. Slight D-width standard — go half up if you have a wide foot. Lace-up closure allows custom fit through the midfoot.',
    sizeChart: [
      { size: 'US 11', eu: 'EU 45', uk: 'UK 10', lengthMm: '290mm' },
      { size: 'US 12', eu: 'EU 46', uk: 'UK 11', lengthMm: '300mm' },
      { size: 'US 13', eu: 'EU 47.5', uk: 'UK 12', lengthMm: '310mm' },
      { size: 'US 14', eu: 'EU 48.5', uk: 'UK 13', lengthMm: '320mm' },
      { size: 'US 15', eu: 'EU 49.5', uk: 'UK 14', lengthMm: '330mm' },
    ],
  },
  {
    pairs: ['p7', 'p1'],
    id: 'p10',
    brand: 'Jordan Brand',
    name: 'Air Jordan 1 High OG',
    price: 180,
    image: require('../assets/images/air-jordan-1.png'),
    inseamMin: 30,
    inseamMax: 42,
    tallTorsoFriendly: false,
    category: 'Shoes',
    sizes: ['11', '12', '13', '14'],
    condition: 'new',
    colorway: 'Black / Metallic Gold',
    style: 'Original high OG silhouette — encapsulated Air unit, rubber cupsole.',
    description:
      'The Air Jordan 1 High OG in Black/Metallic Gold reproduces the original 1985 specifications: premium leather upper, encapsulated Air cushioning, and the vulcanised rubber cupsole. Extended sizing goes to US 14 for tall wearers — the high collar gives visual balance on longer legs.',
    materials: 'Premium tumbled leather upper, Nike Air cushioning, rubber cupsole.',
    fit: 'True to size in length. The high collar is snug on first wear and breaks in over 2–3 sessions. Lace-up allows tightening around a narrow ankle.',
    sizeChart: [
      { size: 'US 11', eu: 'EU 45', uk: 'UK 10', lengthMm: '290mm' },
      { size: 'US 12', eu: 'EU 46', uk: 'UK 11', lengthMm: '300mm' },
      { size: 'US 13', eu: 'EU 47.5', uk: 'UK 12', lengthMm: '310mm' },
      { size: 'US 14', eu: 'EU 48.5', uk: 'UK 13', lengthMm: '320mm' },
    ],
  },
  {
    pairs: ['p6', 'p4'],
    id: 'p11',
    brand: 'New Balance',
    name: '990v5 Made in USA',
    price: 185,
    image: require('../assets/images/990v5.png'),
    inseamMin: 30,
    inseamMax: 42,
    tallTorsoFriendly: false,
    category: 'Shoes',
    sizes: ['11', '12', '13', '14', '15'],
    condition: 'new',
    colorway: 'Gray / Navy',
    style: 'Made in USA with ENCAP midsole — pigskin + mesh upper, wide widths available.',
    description:
      'Made entirely in the USA, the 990v5 is New Balance\'s flagship running-heritage silhouette. ENCAP midsole technology combines a soft polyurethane rim with a firm EVA core for all-day support. Available up to size 15 and in 2E/4E wide widths — essential for tall wearers with larger foot dimensions.',
    materials: 'Pigskin + mesh upper, ENCAP foam midsole, blown rubber outsole. Made in Norridgewock, Maine.',
    fit: 'True to size in D-width (standard). Available in 2E (wide) and 4E (extra wide). Slight rocker profile under the forefoot. Consider going half-up in 2E.',
    sizeChart: [
      { size: 'US 11', eu: 'EU 45', uk: 'UK 10.5', lengthMm: '292mm' },
      { size: 'US 12', eu: 'EU 46.5', uk: 'UK 11.5', lengthMm: '302mm' },
      { size: 'US 13', eu: 'EU 47.5', uk: 'UK 12.5', lengthMm: '312mm' },
      { size: 'US 14', eu: 'EU 48.5', uk: 'UK 13.5', lengthMm: '322mm' },
      { size: 'US 15', eu: 'EU 49.5', uk: 'UK 14.5', lengthMm: '332mm' },
    ],
  },

  // ── OUTERWEAR ──────────────────────────────────────────────────────────────
  {
    pairs: ['p6', 'p5'],
    id: 'p12',
    brand: 'Nike ACG',
    name: 'Therma-FIT ADV Jacket — Long',
    price: 220,
    image: require('../assets/images/nike-therma-fit-jacket.png'),
    inseamMin: 30,
    inseamMax: 42,
    tallTorsoFriendly: true,
    category: 'Outerwear',
    sizes: ['MT', 'LT', 'XLT'],
    condition: 'new',
    colorway: 'Anthracite / Black',
    style: 'All-conditions mountain jacket with extended hem for tall torso coverage.',
    description:
      'Nike ACG\'s Therma-FIT ADV Jacket in a tall-specific long cut adds 3" to the back hem — standard jackets leave a gap between the hem and waistband on tall torsos. Articulated patterning through the shoulders, underarm gussets for range of motion, and a tall collar that actually covers the back of the neck.',
    materials: 'Shell: 100% polyester Therma-FIT ADV. Fill: 550-fill down insulation with water-repellent treatment. DWR-coated outer.',
    fit: 'Athletic fit through the chest and shoulders — size up if layering thick midlayers. Tall sizing adds length at the back hem and sleeve cuff.',
    sizeChart: [
      { size: 'MT',  chest: '40–42"', bodyLength: '30"', sleeve: '36"' },
      { size: 'LT',  chest: '44–46"', bodyLength: '32"', sleeve: '37"' },
      { size: 'XLT', chest: '48–50"', bodyLength: '33"', sleeve: '38"' },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
