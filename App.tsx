
import React, { useState, useMemo, useEffect } from 'react';
import { Stock, BrokerState } from './types';
import { NSE_STOCKS } from './constants';
import { calculateScores } from './utils/scoring';
import Dashboard from './components/Dashboard';
import StockDetail from './components/StockDetail';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('All');
  
  // Broker State
  const [broker, setBroker] = useState<BrokerState>({
    isConnected: false,
    clientId: null,
    availableMargin: 0
  });

  const handleBrokerConnect = () => {
    // Simulate Angel One OAuth login
    setBroker({
      isConnected: true,
      clientId: 'A1-882910',
      availableMargin: 245000.50
    });
  };

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/scan', {
          method: 'GET',
          mode: 'cors',
        });
        
        if (!response.ok) throw new Error('Backend response error');
        
        const data = await response.json();
        
        const mapped: Stock[] = data.map((s: any) => ({
          symbol: s.symbol,
          name: s.name,
          sector: s.sector,
          marketCap: s.marketCap,
          fundamentals: s.fundamentals,
          technicals: s.technicals,
          scores: {
            totalScore: s.totalScore,
            businessQuality: s.fundamentals.roce || 50,
            financialStrength: 100 - (s.fundamentals.debtEquity * 100) || 80,
            growthAcceleration: s.aiProbability,
            smartMoney: s.fundamentals.promoterHolding || 50,
            priceDiscovery: s.technicals.rsi || 50
          }
        }));
        setStocks(mapped);
        setIsOffline(false);
      } catch (err) {
        const fallbackData = NSE_STOCKS.map(s => ({
          ...s,
          scores: calculateScores(s)
        })).sort((a, b) => (b.scores?.totalScore || 0) - (a.scores?.totalScore || 0));
        
        setStocks(fallbackData);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchSearch = s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSector = filterSector === 'All' || s.sector === filterSector;
      return matchSearch && matchSector;
    });
  }, [stocks, searchTerm, filterSector]);

  const currentStock = useMemo(() => 
    stocks.find(s => s.symbol === selectedSymbol), 
    [stocks, selectedSymbol]
  );

  const sectors = useMemo(() => 
    ['All', ...Array.from(new Set(stocks.map(s => s.sector)))], 
    [stocks]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar broker={broker} onConnect={handleBrokerConnect} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse font-medium text-center">
              Scanning NSE/BSE Markets...<br/>
              <span className="text-xs opacity-50">Initializing AI Factor Models</span>
            </p>
          </div>
        ) : selectedSymbol ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedSymbol(null)}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            {currentStock && <StockDetail stock={currentStock} broker={broker} onBrokerConnect={handleBrokerConnect} />}
          </div>
        ) : (
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold gradient-text">AI Market Scanner</h1>
                  {isOffline ? (
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                      Demo Mode
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Live
                    </span>
                  )}
                  {broker.isConnected && (
                    <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter flex items-center gap-1">
                      Angel One Linked
                    </span>
                  )}
                </div>
                <p className="text-slate-400 mt-1">Factor Model (60%) + XGBoost Predictions (40%)</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <select 
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </header>

            <Dashboard 
              stocks={filteredStocks} 
              onSelectStock={setSelectedSymbol}
            />
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2024 Bharat Multi-Bagger AI Scanner. Data refreshed in real-time.</p>
      </footer>
    </div>
  );
};

export default App;
