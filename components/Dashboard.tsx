
import React from 'react';
import { Stock } from '../types';
import StockCard from './StockCard';

interface DashboardProps {
  stocks: Stock[];
  onSelectStock: (symbol: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stocks, onSelectStock }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stocks.length > 0 ? (
        stocks.map(stock => (
          <StockCard 
            key={stock.symbol} 
            stock={stock} 
            onClick={() => onSelectStock(stock.symbol)} 
          />
        ))
      ) : (
        <div className="col-span-full py-20 text-center">
          <p className="text-slate-500 text-lg">No stocks match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
