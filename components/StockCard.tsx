
import React from 'react';
import { Stock } from '../types';
import { getScoreCategory } from '../utils/scoring';

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const scoreInfo = getScoreCategory(stock.scores?.totalScore || 0);

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-2xl p-5 hover:border-blue-500/50 cursor-pointer transition-all hover:translate-y-[-4px] group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{stock.symbol}</h3>
          <p className="text-xs text-slate-500 line-clamp-1">{stock.name}</p>
        </div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${scoreInfo.color} text-white`}>
          {scoreInfo.label}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">₹{stock.technicals.price.toLocaleString()}</div>
          <div className={`text-sm font-medium ${stock.technicals.return6M > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stock.technicals.return6M > 0 ? '+' : ''}{stock.technicals.return6M}% <span className="text-xs text-slate-500 font-normal ml-1">6M</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">AI Score</span>
            <span className={`font-bold ${scoreInfo.text}`}>{stock.scores?.totalScore.toFixed(1)}/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${scoreInfo.color}`} 
              style={{ width: `${stock.scores?.totalScore}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase">Growth</p>
            <p className="text-xs font-semibold text-slate-300">{stock.fundamentals.revenueGrowth3Y}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase">ROCE</p>
            <p className="text-xs font-semibold text-slate-300">{stock.fundamentals.roce}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
