
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
    // Simulate Angel One OAuth login process
    try {
      setBroker({
        isConnected: true,
        clientId: 'A1-882910',
        availableMargin: 245000.50
      });
    } catch (err) {
      console.error("Broker connection failed", err);
    }
  };

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      try {
        // Attempt to fetch from local Python backend (FastAPI)
        const response = await fetch('http://localhost:8000/api/scan', {
          method: 'GET',
          mode: 'cors',
          signal: AbortSignal.timeout(5000) // 5s timeout
        });
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const data = await response.json();
        
        if (!Array.isArray(data)) throw new Error("Invalid data format from backend");

        const mapped: Stock[] = data.map((s: any) => ({
          symbol: s.symbol || 'N/A',
          name: s.name || 'Unknown Entity',
          sector: s.sector || 'Uncategorized',
          marketCap: s.marketCap || 0,
          fundamentals: s.fundamentals || {},
          technicals: s.technicals || {},
          scores: {
            totalScore: s.totalScore || 0,
            businessQuality: s.fundamentals?.roce || 50,
            financialStrength: s.fundamentals?.debtEquity !== undefined ? (100 - (s.fundamentals.debtEquity * 100)) : 80,
            growthAcceleration: s.aiProbability || 50,
            smartMoney: s.fundamentals?.promoterHolding || 50,
            priceDiscovery: s.technicals?.rsi || 50
          }
        }));
        setStocks(mapped);
        setIsOffline(false);
      } catch (err) {
        console.warn("Backend unavailable or error occurred. Running in Client-Side Fallback Mode.", err);
        
        // FAILSAFE: Use local NSE_STOCKS constants and compute scores in browser
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
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <Navbar broker={broker} onConnect={handleBrokerConnect} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-100 mb-1">Scanning Indian Markets</p>
              <p className="text-slate-500 text-sm animate-pulse font-mono uppercase tracking-widest">
                Computing Quantum Alpha Signals...
              </p>
            </div>
          </div>
        ) : selectedSymbol ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedSymbol(null)}
              className="group flex items-center text-slate-400 hover:text-blue-400 transition-all font-medium text-sm"
            >
              <div className="mr-2 p-1 rounded-full bg-slate-800 group-hover:bg-blue-500/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              Back to Dashboard
            </button>
            {currentStock && <StockDetail stock={currentStock} broker={broker} onBrokerConnect={handleBrokerConnect} />}
          </div>
        ) : (
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black gradient-text tracking-tight">Market Radar</h1>
                  {isOffline ? (
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-widest">
                      Offline Mode
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Systems Active
                    </span>
                  )}
                </div>
                <p className="text-slate-400 max-w-lg">Advanced Multi-Factor scoring across Fundamental & Technical dimensions with XGBoost inference.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <select 
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value)}
                    className="relative bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
                  >
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search Symbol or Company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <footer className="py-8 border-t border-slate-800/50 bg-slate-900/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© 2024 Bharat Multi-Bagger Scanner. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-slate-300 transition-colors">Term of Service</a>
             <a href="#" className="hover:text-slate-300 transition-colors">Risk Disclosure</a>
             <a href="#" className="hover:text-slate-300 transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
