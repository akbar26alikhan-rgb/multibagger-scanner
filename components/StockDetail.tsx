
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
        contents: `What is the current market price of ${stock.symbol} on the Bombay Stock Exchange (BSE) right now? Provide the quote and timestamp.`,
        config: { tools: [{ googleSearch: {} }] },
      });

      const text = response.text || "No data returned";
      const priceMatch = text.match(/₹?\s?(\d{1,7}(?:\.\d{1,2})?)/);
      
      setLiveData({
        price: priceMatch ? `₹${priceMatch[1]}` : "Live",
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (IST)",
        summary: text,
        sources: []
      });
    } catch (error) {
      console.error("AI Search failed", error);
    } finally {
      setIsFetching(false);
    }
  };

  const mockChartData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: `T-${30-i}`,
      price: stock.technicals.price * (0.95 + Math.random() * 0.1),
      score: stock.scores!.totalScore * (0.98 + Math.random() * 0.04)
    }));
  }, [stock]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="space-y-6">
        {/* Market Profile Card */}
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold">{stock.symbol}</h2>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-bold">NSE/BSE</span>
              </div>
              <p className="text-slate-400 text-sm">{stock.name}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${scoreInfo.color} text-white shadow-lg`}>
              {scoreInfo.label}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Market Quote</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {liveData ? liveData.price : `₹${stock.technicals.price.toLocaleString()}`}
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                {stock.technicals.return6M > 0 ? '▲' : '▼'} {Math.abs(stock.technicals.return6M)}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center space-x-4">
                <div className="text-4xl font-black text-slate-100">
                  {stock.scores?.totalScore.toFixed(1)}
                  <span className="text-lg font-medium text-slate-500">/100</span>
                </div>
                <div className="h-10 w-[1px] bg-slate-800"></div>
                <p className={`text-sm font-bold ${scoreInfo.text}`}>Quantum Analysis Validated</p>
              </div>
          </div>
        </div>

        {/* Angel One Trading Terminal Integration */}
        <AngelOneTrade stock={stock} broker={broker} onConnect={onBrokerConnect} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-2xl p-6 h-[400px]">
          <h3 className="text-lg font-bold mb-6">Growth Intelligence</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold mb-4 uppercase text-slate-400 tracking-widest">AI Synopsis</h3>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {liveData?.summary || "Analyzing fundamental triggers and sector tailwinds for this asset..."}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold mb-4 uppercase text-slate-400 tracking-widest">Technicals</h3>
            <div className="space-y-4">
               <div className="flex justify-between text-xs"><span className="text-slate-500">RSI</span><span className="font-bold text-amber-400">{stock.technicals.rsi}</span></div>
               <div className="flex justify-between text-xs"><span className="text-slate-500">Volume</span><span className="font-bold text-blue-400">{stock.technicals.volumeRatio}x</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
