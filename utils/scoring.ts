
import { Stock, StockScores, StockFundamentals, StockTechnicals } from '../types';

const clip = (val: number) => Math.min(100, Math.max(0, val));

export const calculateScores = (stock: Stock): StockScores => {
  const f = stock.fundamentals;
  const t = stock.technicals;

  // 1. BUSINESS QUALITY
  const roceScore = f.roce >= 25 ? 100 : f.roce >= 20 ? 80 : f.roce >= 15 ? 60 : f.roce >= 10 ? 40 : 0;
  const marginScore = f.marginTrend === 'increasing' ? 100 : f.marginTrend === 'stable' ? 70 : 30;
  const cashflowScore = f.cfoPatRatio >= 1 ? 100 : f.cfoPatRatio >= 0.8 ? 70 : f.cfoPatRatio >= 0.6 ? 40 : 0;
  const assetScore = f.assetTurnoverTrend === 'improving' ? 100 : f.assetTurnoverTrend === 'stable' ? 60 : 20;
  const businessQuality = clip(0.35 * roceScore + 0.20 * marginScore + 0.30 * cashflowScore + 0.15 * assetScore);

  // 2. FINANCIAL STRENGTH
  const debtScore = f.debtEquity < 0.3 ? 100 : f.debtEquity < 0.6 ? 80 : f.debtEquity <= 1 ? 50 : 0;
  const interestScore = f.interestCoverage > 6 ? 100 : f.interestCoverage > 4 ? 80 : f.interestCoverage > 3 ? 60 : 20;
  const reserveScore = f.reservesGrowth > 15 ? 100 : f.reservesGrowth > 5 ? 70 : f.reservesGrowth > 0 ? 40 : 0;
  const dilutionScore = !f.hasDilution ? 100 : 30;
  const financialStrength = clip(0.35 * debtScore + 0.25 * interestScore + 0.25 * reserveScore + 0.15 * dilutionScore);

  // 3. GROWTH ACCELERATION
  const salesGrowthScore = Math.min(100, f.revenueGrowth3Y * 4);
  const profitGrowthScore = Math.min(100, f.profitGrowth3Y * 4);
  const accelerationBonus = f.recentGrowth > f.revenueGrowth3Y ? 100 : 40;
  const roceTrendScore = f.marginTrend === 'increasing' ? 100 : f.marginTrend === 'stable' ? 60 : 20; // Approximation
  const epsTrendScore = f.epsTrend === 'rising' ? 100 : f.epsTrend === 'volatile' ? 50 : 0;
  const growthAcceleration = clip(0.25 * salesGrowthScore + 0.20 * accelerationBonus + 0.25 * profitGrowthScore + 0.15 * roceTrendScore + 0.15 * epsTrendScore);

  // 4. SMART MONEY
  const promoterLevel = f.promoterHolding >= 60 ? 100 : f.promoterHolding >= 50 ? 80 : f.promoterHolding >= 40 ? 60 : 20;
  const promoterChange = f.promoterChange === 'increasing' ? 100 : f.promoterChange === 'stable' ? 60 : 20;
  const pledgeScore = f.pledge < 5 ? 100 : f.pledge < 15 ? 70 : f.pledge < 30 ? 40 : 0;
  const instiScore = f.instiHoldingChange === 'increasing' ? 100 : f.instiHoldingChange === 'stable' ? 60 : 20;
  const smartMoney = clip(0.30 * promoterLevel + 0.25 * promoterChange + 0.20 * pledgeScore + 0.25 * instiScore);

  // 5. PRICE DISCOVERY
  const distFromHigh = ((t.fiftyTwoWeekHigh - t.price) / t.fiftyTwoWeekHigh) * 100;
  const highDistScore = distFromHigh <= 15 ? 100 : distFromHigh <= 30 ? 80 : distFromHigh <= 50 ? 50 : 20;
  const dmaScore = t.price > t.dma200 ? 100 : 30;
  const volumeScore = t.volumeRatio > 2 ? 100 : t.volumeRatio >= 1.5 ? 80 : t.volumeRatio >= 1 ? 50 : 20;
  const returnScore = (t.return6M >= 10 && t.return6M <= 60) ? 100 : t.return6M > 0 ? 70 : t.return6M > 60 ? 40 : 20;
  const rsiScore = (t.rsi >= 55 && t.rsi <= 70) ? 100 : (t.rsi >= 45 && t.rsi < 55) ? 70 : (t.rsi >= 70 && t.rsi <= 80) ? 40 : 20;
  const priceDiscovery = clip(0.20 * highDistScore + 0.25 * dmaScore + 0.20 * volumeScore + 0.20 * returnScore + 0.15 * rsiScore);

  const totalScore = clip(
    0.20 * businessQuality +
    0.15 * financialStrength +
    0.25 * growthAcceleration +
    0.20 * smartMoney +
    0.20 * priceDiscovery
  );

  return {
    businessQuality,
    financialStrength,
    growthAcceleration,
    smartMoney,
    priceDiscovery,
    totalScore
  };
};

export const getScoreCategory = (score: number) => {
  if (score >= 85) return { label: 'Early Multibagger', color: 'bg-emerald-500', text: 'text-emerald-500' };
  if (score >= 75) return { label: 'Strong Buy', color: 'bg-blue-500', text: 'text-blue-500' };
  if (score >= 65) return { label: 'Watchlist', color: 'bg-amber-500', text: 'text-amber-500' };
  return { label: 'Ignore', color: 'bg-slate-500', text: 'text-slate-500' };
};
