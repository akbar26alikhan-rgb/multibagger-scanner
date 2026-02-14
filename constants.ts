
import { Stock } from './types';

export const NSE_STOCKS: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    sector: "Energy/Telecom",
    marketCap: 1700000,
    fundamentals: {
      revenueGrowth3Y: 12,
      profitGrowth3Y: 15,
      roce: 18,
      roe: 14,
      margin: 16,
      marginTrend: 'stable',
      debtEquity: 0.4,
      interestCoverage: 8,
      reservesGrowth: 12,
      hasDilution: false,
      promoterHolding: 50.6,
      promoterChange: 'stable',
      pledge: 0,
      instiHoldingChange: 'increasing',
      eps: 95,
      epsTrend: 'rising',
      cfoPatRatio: 1.1,
      assetTurnoverTrend: 'stable',
      recentGrowth: 14
    },
    technicals: {
      price: 2950,
      fiftyTwoWeekHigh: 3020,
      dma200: 2600,
      volumeRatio: 1.2,
      return6M: 25,
      rsi: 62
    }
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "IT Services",
    marketCap: 1450000,
    fundamentals: {
      revenueGrowth3Y: 15,
      profitGrowth3Y: 18,
      roce: 45,
      roe: 42,
      margin: 24,
      marginTrend: 'stable',
      debtEquity: 0.05,
      interestCoverage: 50,
      reservesGrowth: 20,
      hasDilution: false,
      promoterHolding: 72,
      promoterChange: 'stable',
      pledge: 0,
      instiHoldingChange: 'stable',
      eps: 120,
      epsTrend: 'rising',
      cfoPatRatio: 0.95,
      assetTurnoverTrend: 'improving',
      recentGrowth: 16
    },
    technicals: {
      price: 3850,
      fiftyTwoWeekHigh: 4200,
      dma200: 3600,
      volumeRatio: 1.1,
      return6M: 12,
      rsi: 55
    }
  },
  {
    symbol: "HAL",
    name: "Hindustan Aeronautics Ltd",
    sector: "Defense",
    marketCap: 350000,
    fundamentals: {
      revenueGrowth3Y: 28,
      profitGrowth3Y: 35,
      roce: 32,
      roe: 28,
      margin: 22,
      marginTrend: 'increasing',
      debtEquity: 0.1,
      interestCoverage: 25,
      reservesGrowth: 22,
      hasDilution: false,
      promoterHolding: 71.6,
      promoterChange: 'stable',
      pledge: 0,
      instiHoldingChange: 'increasing',
      eps: 210,
      epsTrend: 'rising',
      cfoPatRatio: 1.2,
      assetTurnoverTrend: 'improving',
      recentGrowth: 40
    },
    technicals: {
      price: 4950,
      fiftyTwoWeekHigh: 5200,
      dma200: 3800,
      volumeRatio: 2.5,
      return6M: 85,
      rsi: 68
    }
  },
  {
    symbol: "MAZAGON",
    name: "Mazagon Dock Shipbuilders",
    sector: "Shipbuilding",
    marketCap: 85000,
    fundamentals: {
      revenueGrowth3Y: 45,
      profitGrowth3Y: 55,
      roce: 38,
      roe: 32,
      margin: 18,
      marginTrend: 'increasing',
      debtEquity: 0.0,
      interestCoverage: 999,
      reservesGrowth: 30,
      hasDilution: false,
      promoterHolding: 84.8,
      promoterChange: 'stable',
      pledge: 0,
      instiHoldingChange: 'increasing',
      eps: 145,
      epsTrend: 'rising',
      cfoPatRatio: 1.4,
      assetTurnoverTrend: 'improving',
      recentGrowth: 60
    },
    technicals: {
      price: 4200,
      fiftyTwoWeekHigh: 4500,
      dma200: 2500,
      volumeRatio: 3.2,
      return6M: 140,
      rsi: 72
    }
  },
  {
    symbol: "TITAN",
    name: "Titan Company Ltd",
    sector: "Consumer",
    marketCap: 320000,
    fundamentals: {
      revenueGrowth3Y: 22,
      profitGrowth3Y: 25,
      roce: 24,
      roe: 28,
      margin: 11,
      marginTrend: 'stable',
      debtEquity: 0.8,
      interestCoverage: 5,
      reservesGrowth: 15,
      hasDilution: false,
      promoterHolding: 52.9,
      promoterChange: 'stable',
      pledge: 0,
      instiHoldingChange: 'decreasing',
      eps: 45,
      epsTrend: 'rising',
      cfoPatRatio: 0.8,
      assetTurnoverTrend: 'stable',
      recentGrowth: 20
    },
    technicals: {
      price: 3400,
      fiftyTwoWeekHigh: 3800,
      dma200: 3500,
      volumeRatio: 0.8,
      return6M: -5,
      rsi: 42
    }
  }
];
