import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { StockState } from '@/data/products';
import { PRODUCTS, getProduct } from '@/data/products';
import type { TorsoType } from '@/constants/Theme';

export type FitFeedback = 'sleeve_short' | 'inseam_short' | null;

export type Order = {
  id: string;
  productId: string;
  size: string;
  price: number;
  paymentMethod: 'apple_pay' | 'card';
  date: string;
};

type DemoSession = { email: string; displayName: string } | null;

type FloodedState = {
  heightIn: number;
  inseam: number;
  torso: TorsoType;
  hipToWaist: number;
  sleeveLength: number;
  shoulderWidth: number;
  waistIn: number;
  profileSaved: boolean;
  trackedIds: string[];
  /** productId → the size the user wants tracked */
  trackedSizes: Record<string, string>;
  stockById: Record<string, StockState>;
  fitNotes: string[];
  lastRestockMessage: string | null;
  session: DemoSession;
  wishlist: string[];
  orders: Order[];
  /** Last 6 viewed product IDs, newest first */
  recentlyViewed: string[];
  /** Whether the fit-match explainer has been dismissed */
  fitExplainerDismissed: boolean;
};

const defaultStock = (): Record<string, StockState> =>
  PRODUCTS.reduce((acc, p, i) => {
    acc[p.id] = i % 3 === 0 ? 'in_stock' : i % 3 === 1 ? 'low' : 'out';
    return acc;
  }, {} as Record<string, StockState>);

const torsoOrder: TorsoType[] = ['Standard', 'Long', 'Extra Long'];
function torsoRank(t: TorsoType) { return torsoOrder.indexOf(t); }

// ── Fit-score helpers ──────────────────────────────────────────────────────

/** Parse a measurement string like '35"' or '36.5"' → number */
function parseMeasure(s: string | undefined): number {
  if (!s) return 0;
  return parseFloat(s);
}

/** Parse a range string like '42–44"' → [42, 44] */
function parseRange(s: string | undefined): [number, number] | null {
  if (!s) return null;
  const parts = s.split('–');
  if (parts.length < 2) return [parseFloat(parts[0]), parseFloat(parts[0])];
  return [parseFloat(parts[0]), parseFloat(parts[1])];
}

function calcFitScore(
  productId: string,
  { inseam, torso, sleeveLength, shoulderWidth, waistIn, hipToWaist }: {
    inseam: number; torso: TorsoType; sleeveLength: number;
    shoulderWidth: number; waistIn: number; hipToWaist: number;
  },
): number {
  const p = getProduct(productId);
  if (!p) return 72;

  // Shoes: fit by size, not body proportion. Tall people benefit from extended sizes.
  if (p.category === 'Shoes') {
    const hasExtended = p.sizes.some(s => parseInt(s) >= 13);
    return hasExtended ? 91 : 78;
  }

  let score = 58;

  if (p.category === 'Tops' || p.category === 'Outerwear') {
    // ── Sleeve length ──
    const chartSleeveNums = p.sizeChart.map(r => parseMeasure(r.sleeve)).filter(n => n > 0);
    if (chartSleeveNums.length > 0) {
      const maxSleeve = Math.max(...chartSleeveNums);
      if (maxSleeve >= sleeveLength) score += 18;
      else if (maxSleeve >= sleeveLength - 0.5) score += 12;
      else if (maxSleeve >= sleeveLength - 1) score += 6;
      else score -= 4;
    }

    // ── Tall-torso fit ──
    const rank = torsoRank(torso);
    if (p.tallTorsoFriendly) {
      score += rank >= 2 ? 14 : rank >= 1 ? 10 : 5;
    } else {
      score += rank >= 2 ? -6 : rank >= 1 ? -2 : 4;
    }

    // ── Chest / shoulder ──
    const estChest = shoulderWidth * 2.2;
    const hasChestMatch = p.sizeChart.some(r => {
      const range = parseRange(r.chest);
      if (!range) return false;
      return estChest >= range[0] - 1 && estChest <= range[1] + 1;
    });
    score += hasChestMatch ? 10 : 2;
  }

  if (p.category === 'Bottoms') {
    // ── Inseam (primary) ──
    if (inseam >= p.inseamMin && inseam <= p.inseamMax) {
      score += 24;
    } else if (inseam >= p.inseamMin - 1 && inseam <= p.inseamMax + 1) {
      score += 14;
    } else {
      score -= 6;
    }

    // ── Waist ──
    const hasWaistMatch = p.sizeChart.some(r => {
      const w = parseMeasure(r.waist);
      return w > 0 && Math.abs(w - waistIn) <= 1;
    });
    score += hasWaistMatch ? 12 : 4;

    // ── Hip (estimated from waist × hipToWaist ratio) ──
    const estHip = waistIn * hipToWaist;
    const hasHipMatch = p.sizeChart.some(r => {
      const h = parseMeasure(r.hip);
      return h > 0 && Math.abs(h - estHip) <= 2;
    });
    score += hasHipMatch ? 6 : 0;
  }

  return Math.min(99, Math.max(52, score));
}

// ── Context type ──────────────────────────────────────────────────────────

type Ctx = FloodedState & {
  setHeightIn: (n: number) => void;
  setInseam: (n: number) => void;
  setTorso: (t: TorsoType) => void;
  setHipToWaist: (n: number) => void;
  setSleeveLength: (n: number) => void;
  setShoulderWidth: (n: number) => void;
  setWaistIn: (n: number) => void;
  profileCompleteness: number;
  saveProfile: () => void;
  trackProduct: (id: string, size?: string) => void;
  untrackProduct: (id: string) => void;
  setTrackedSize: (id: string, size: string) => void;
  trackedSizeFor: (id: string) => string | undefined;
  stockFor: (id: string) => StockState;
  simulateRestock: () => string | null;
  submitFitFeedback: (kind: Exclude<FitFeedback, null>) => void;
  matchPercentForProduct: (id: string) => number;
  signUpDemo: (email: string, displayName: string) => void;
  signInDemo: (email: string, displayName?: string) => void;
  signOutDemo: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  addOrder: (data: { productId: string; size: string; price: number; paymentMethod: 'apple_pay' | 'card' }) => Order;
  addRecentlyViewed: (id: string) => void;
  dismissFitExplainer: () => void;
};

const FloodedContext = createContext<Ctx | null>(null);

export function FloodedProvider({ children }: { children: React.ReactNode }) {
  const [heightIn, setHeightIn] = useState(74);
  const [inseam, setInseam] = useState(36);
  const [torso, setTorso] = useState<TorsoType>('Long');
  const [hipToWaist, setHipToWaist] = useState(1.15);
  const [sleeveLength, setSleeveLength] = useState(34);
  const [shoulderWidth, setShoulderWidth] = useState(18);
  const [waistIn, setWaistIn] = useState(32);
  const [profileSaved, setProfileSaved] = useState(false);
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [trackedSizes, setTrackedSizes] = useState<Record<string, string>>({});
  const [stockById, setStockById] = useState<Record<string, StockState>>(defaultStock);
  const [fitNotes, setFitNotes] = useState<string[]>([]);
  const [lastRestockMessage, setLastRestockMessage] = useState<string | null>(null);
  const [session, setSession] = useState<DemoSession>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [fitExplainerDismissed, setFitExplainerDismissed] = useState(false);

  const signUpDemo = useCallback((email: string, displayName: string) => {
    setSession({ email: email.trim(), displayName: displayName.trim() || 'Member' });
  }, []);
  const signInDemo = useCallback((email: string, displayName?: string) => {
    setSession({ email: email.trim(), displayName: displayName?.trim() || 'Member' });
  }, []);
  const signOutDemo = useCallback(() => setSession(null), []);
  const saveProfile = useCallback(() => setProfileSaved(true), []);

  const profileCompleteness = useMemo(() => {
    if (profileSaved) return 100;
    let n = 0;
    if (heightIn > 0) n += 1;
    if (inseam > 0) n += 1;
    if (torso) n += 1;
    if (sleeveLength > 0) n += 1;
    if (shoulderWidth > 0) n += 1;
    if (waistIn > 0) n += 1;
    return Math.round((n / 6) * 72);
  }, [profileSaved, heightIn, inseam, torso, sleeveLength, shoulderWidth, waistIn]);

  const trackProduct = useCallback((id: string, size?: string) => {
    setTrackedIds(prev => prev.includes(id) ? prev : [...prev, id]);
    if (size) setTrackedSizes(prev => ({ ...prev, [id]: size }));
    setLastRestockMessage(null);
  }, []);

  const untrackProduct = useCallback((id: string) => {
    setTrackedIds(prev => prev.filter(x => x !== id));
    setTrackedSizes(prev => { const next = { ...prev }; delete next[id]; return next; });
  }, []);

  const setTrackedSize = useCallback((id: string, size: string) => {
    setTrackedSizes(prev => ({ ...prev, [id]: size }));
  }, []);

  const trackedSizeFor = useCallback(
    (id: string) => trackedSizes[id],
    [trackedSizes],
  );

  const stockFor = useCallback((id: string) => stockById[id] ?? 'out', [stockById]);

  const simulateRestock = useCallback(() => {
    const trackedOut = trackedIds.filter(id => stockById[id] === 'out');
    if (trackedOut.length === 0) {
      const msg = 'Add sold-out items to Alerts, then try again.';
      setLastRestockMessage(msg);
      return msg;
    }
    const pick = trackedOut[Math.floor(Math.random() * trackedOut.length)];
    setStockById(prev => ({ ...prev, [pick]: 'in_stock' }));
    const p = getProduct(pick);
    const size = trackedSizes[pick];
    const name = p ? `${p.brand} ${p.name}` : pick;
    const msg = `${name}${size ? ` (size ${size})` : ''} is back in stock!`;
    setLastRestockMessage(msg);
    return msg;
  }, [trackedIds, stockById, trackedSizes]);

  const submitFitFeedback = useCallback((kind: Exclude<FitFeedback, null>) => {
    if (kind === 'sleeve_short') {
      setSleeveLength(prev => Math.min(40, prev + 0.5));
      setFitNotes(n => [...n, 'Logged: sleeves short — sleeve preference raised.']);
    } else {
      setInseam(prev => Math.min(42, prev + 1));
      setFitNotes(n => [...n, 'Logged: inseam short — inseam preference raised.']);
    }
  }, []);

  const matchPercentForProduct = useCallback(
    (id: string) => calcFitScore(id, { inseam, torso, sleeveLength, shoulderWidth, waistIn, hipToWaist }),
    [inseam, torso, sleeveLength, shoulderWidth, waistIn, hipToWaist],
  );

  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);
  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const addOrder = useCallback(
    (data: { productId: string; size: string; price: number; paymentMethod: 'apple_pay' | 'card' }): Order => {
      const order: Order = { id: `ord-${Date.now()}`, ...data, date: new Date().toISOString() };
      setOrders(prev => [order, ...prev]);
      return order;
    },
    [],
  );

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(x => x !== id);
      return [id, ...filtered].slice(0, 6);
    });
  }, []);

  const dismissFitExplainer = useCallback(() => setFitExplainerDismissed(true), []);

  const value = useMemo(
    () => ({
      heightIn, inseam, torso, hipToWaist, sleeveLength, shoulderWidth, waistIn,
      profileSaved, trackedIds, trackedSizes, stockById, fitNotes, lastRestockMessage,
      session, profileCompleteness, wishlist, orders, recentlyViewed, fitExplainerDismissed,
      setHeightIn, setInseam, setTorso, setHipToWaist, setSleeveLength, setShoulderWidth, setWaistIn,
      saveProfile, trackProduct, untrackProduct, setTrackedSize, trackedSizeFor,
      stockFor, simulateRestock, submitFitFeedback, matchPercentForProduct,
      signUpDemo, signInDemo, signOutDemo,
      toggleWishlist, isWishlisted, addOrder, addRecentlyViewed, dismissFitExplainer,
    }) satisfies Ctx,
    [
      heightIn, inseam, torso, hipToWaist, sleeveLength, shoulderWidth, waistIn,
      profileSaved, trackedIds, trackedSizes, stockById, fitNotes, lastRestockMessage,
      session, profileCompleteness, wishlist, orders, recentlyViewed, fitExplainerDismissed,
      saveProfile, trackProduct, untrackProduct, setTrackedSize, trackedSizeFor,
      stockFor, simulateRestock, submitFitFeedback, matchPercentForProduct,
      signUpDemo, signInDemo, signOutDemo,
      toggleWishlist, isWishlisted, addOrder, addRecentlyViewed, dismissFitExplainer,
    ],
  );

  return <FloodedContext.Provider value={value}>{children}</FloodedContext.Provider>;
}

export function useFlooded() {
  const v = useContext(FloodedContext);
  if (!v) throw new Error('useFlooded must be used within FloodedProvider');
  return v;
}
