
import React, { useState } from 'react';
import { Stock, BrokerState, OrderRequest } from '../types';

interface AngelOneTradeProps {
  stock: Stock;
  broker: BrokerState;
  onConnect: () => void;
}

const AngelOneTrade: React.FC<AngelOneTradeProps> = ({ stock, broker, onConnect }) => {
  const [qty, setQty] = useState<number>(1);
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('MARKET');
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const estimatedValue = qty * stock.technicals.price;

  const handlePlaceOrder = async () => {
    if (!broker.isConnected) {
      onConnect();
      return;
    }
    
    setIsPlacing(true);
    // Simulate SmartAPI Order Placement
    setTimeout(() => {
      setIsPlacing(false);
      setOrderStatus('success');
      setTimeout(() => setOrderStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-orange-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
          </div>
          <h3 className="font-bold text-slate-100">Angel One Terminal</h3>
        </div>
        {broker.isConnected ? (
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
            CONNECTED: {broker.clientId}
          </span>
        ) : (
          <button 
            onClick={onConnect}
            className="text-[10px] text-orange-400 font-bold hover:underline"
          >
            CONNECT BROKER
          </button>
        )}
      </div>

      {!broker.isConnected ? (
        <div className="text-center py-4">
          <p className="text-xs text-slate-400 mb-4">Connect your Angel One account to enable instant execution from the scanner.</p>
          <button 
            onClick={onConnect}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20"
          >
            Login to SmartAPI
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Quantity</label>
              <input 
                type="number" 
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Order Type</label>
              <select 
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
              >
                <option value="MARKET">Market</option>
                <option value="LIMIT">Limit</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Est. Order Value</span>
              <span className="text-slate-200 font-bold">₹{estimatedValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Avail. Margin</span>
              <span className="text-emerald-400 font-bold">₹{broker.availableMargin.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={isPlacing || orderStatus === 'success'}
            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              orderStatus === 'success' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isPlacing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : orderStatus === 'success' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Order Placed
              </>
            ) : (
              `Buy ${stock.symbol}`
            )}
          </button>
          
          <p className="text-[9px] text-slate-500 text-center italic">
            Executed via Angel One SmartAPI v2.0
          </p>
        </div>
      )}
    </div>
  );
};

export default AngelOneTrade;
