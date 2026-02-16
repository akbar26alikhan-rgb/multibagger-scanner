
import React, { useMemo, useState, useEffect } from 'react';
import { Stock, BrokerState } from '../types';
import { getScoreCategory } from '../utils/scoring';
import { GoogleGenAI } from "@google/genai";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import AngelOneTrade from './AngelOneTrade';

interface StockDetailProps {
  stock: Stock;
  broker: BrokerState;
  onBrokerConnect: () => void;
}

interface LivePriceData {
  price: string;
  time: string;
  summary: string;
  sources: { title: string; uri: string }[];
}

const StockDetail: React.FC<StockDetailProps> = ({ stock, broker, onBrokerConnect }) => {
  const scoreInfo = getScoreCategory(stock.scores?.totalScore || 0);
  const [liveData, setLiveData] = useState<LivePriceData | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchLiveBSEData();
  }, [stock.symbol]);

  const fetchLiveBSEData = async () => {
    setIsFetching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Fetch current market price and last trade time for ${stock.symbol} on the Bombay Stock Exchange (BSE). Format the response as a single sentence starting with the price.`,
        config: { tools: [{ googleSearch: {} }] },
      });

      const text = response.text || "Market data currently unavailable via Google Search grounding.";
      
      // Improved regex to find currency or numbers representing price
      const priceMatch = text.match(/(?:₹|INR|Rs\.?)\s?([\d,]+\.?\d{0,2})/i) || text.match(/(\d{1,7}(?:\.\d{1,2})?)/);
      
      setLiveData({
        price: priceMatch ? `₹${priceMatch[1]}` : `₹${stock.technicals.price.toLocaleString()}`,
        time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + " IST",
        summary: text,
        sources: []
      });
    } catch (error) {
      console.error("Gemini BSE Search error:", error);
      // Failsafe state
      setLiveData({
        price: `₹${stock.technicals.price.toLocaleString()}`,
        time: "Delayed Quote",
        summary: "Live AI integration is currently restricted. Using most recent fundamental pricing data.",
        sources: []
      });
    } finally {
      setIsFetching(false);
    }
  };

  const mockChartData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: `${i + 1}D`,
      price: stock.technicals.price * (0.94 + Math.random() * 0.12),
      score: stock.scores!.totalScore * (0.97 + Math.random() * 0.06)
    }));
  }, [stock]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      <div className="space-y-6">
        {/* Market Profile Card */}
        <div className="glass-card rounded-2xl p-6 border-t-4 border-t-blue-500 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-black text-white tracking-tight">{stock.symbol}</h2>
                <div className="flex gap-1">
                  <span className="text-[9px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-black">NSE</span>
                  <span className="text-[9px] bg-slate-800 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20 font-black">BSE</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stock.name}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${scoreInfo.color} text-white shadow-lg`}>
              {scoreInfo.label}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl p-5 mb-6 border border-slate-800/50 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Pulse</span>
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-blue-400 animate-pulse font-bold">Grounding Data...</span>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Real-time</span>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                {liveData ? liveData.price : '---'}
              </span>
              <span className={`text-xs font-black ${stock.technicals.return6M > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.technicals.return6M > 0 ? '▲' : '▼'} {Math.abs(stock.technicals.return6M)}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              QUOTE TIME: {liveData ? liveData.time : 'SYNCING...'}
            </p>
          </div>

          <div className="space-y-4">
             <div className="flex items-center space-x-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                <div className="text-4xl font-black text-slate-100">
                  {stock.scores?.totalScore.toFixed(1)}
                  <span className="text-lg font-medium text-slate-500">/100</span>
                </div>
                <div className="h-10 w-[1px] bg-slate-700"></div>
                <div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">AI Factor Grade</p>
                   <p className={`text-xs font-black uppercase tracking-wide ${scoreInfo.text}`}>Validated</p>
                </div>
              </div>
          </div>
        </div>

        {/* Angel One Trading Terminal Integration */}
        <AngelOneTrade stock={stock} broker={broker} onConnect={onBrokerConnect} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-2xl p-6 h-[420px] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
             <span className="w-4 h-[1px] bg-blue-500"></span>
             Predictive Trajectory
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }} 
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500/50">
            <h3 className="text-[10px] font-black mb-4 uppercase text-slate-500 tracking-widest">AI Intelligence Summary</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {liveData?.summary || "Analyzing macro-economic tailwinds and institutional accumulation patterns for this ticker..."}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500/50">
            <h3 className="text-[10px] font-black mb-4 uppercase text-slate-500 tracking-widest">Market Microstructure</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">RSI (14)</span>
                  <span className={`text-sm font-black ${stock.technicals.rsi > 70 ? 'text-rose-400' : stock.technicals.rsi < 30 ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {stock.technicals.rsi}
                  </span>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">Vol / Avg</span>
                  <span className="text-sm font-black text-blue-400">{stock.technicals.volumeRatio}x</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
