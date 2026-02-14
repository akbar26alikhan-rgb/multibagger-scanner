
export enum ScoreCategory {
  EXCELLENT = 'EXCELLENT', // >= 85
  STRONG = 'STRONG',      // 75-85
  WATCHLIST = 'WATCHLIST', // 65-75
  IGNORE = 'IGNORE'       // < 65
}

export interface BrokerState {
  isConnected: boolean;
  clientId: string | null;
  availableMargin: number;
}

export interface OrderRequest {
  symbol: string;
  quantity: number;
  price: number;
  orderType: 'LIMIT' | 'MARKET';
  productType: 'DELIVERY' | 'INTRADAY';
  transactionType: 'BUY' | 'SELL';
}

export interface StockFundamentals {
  revenueGrowth3Y: number;
  profitGrowth3Y: number;
  roce: number;
  roe: number;
  margin: number;
  marginTrend: 'increasing' | 'stable' | 'declining';
  debtEquity: number;
  interestCoverage: number;
  reservesGrowth: number;
  hasDilution: boolean;
  promoterHolding: number;
  promoterChange: 'increasing' | 'stable' | 'decreasing';
  pledge: number;
  instiHoldingChange: 'increasing' | 'stable' | 'decreasing';
  eps: number;
  epsTrend: 'rising' | 'volatile' | 'falling';
  cfoPatRatio: number;
  assetTurnoverTrend: 'improving' | 'stable' | 'declining';
  recentGrowth: number; 
}

export interface StockTechnicals {
  price: number;
  fiftyTwoWeekHigh: number;
  dma200: number;
  volumeRatio: number;
  return6M: number;
  rsi: number;
}

export interface StockScores {
  businessQuality: number;
  financialStrength: number;
  growthAcceleration: number;
  smartMoney: number;
  priceDiscovery: number;
  totalScore: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; 
  fundamentals: StockFundamentals;
  technicals: StockTechnicals;
  scores?: StockScores;
}

export interface ChartDataPoint {
  date: string;
  price: number;
  score: number;
}
