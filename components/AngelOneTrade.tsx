
import React, { useState } from 'react';
import { Stock, BrokerState } from '../types';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const price = stock?.technicals?.price || 0;
  const estimatedValue = qty * price;

  const handlePlaceOrder = async () => {
    setErrorMessage(null);
    
    if (!broker.isConnected) {
      onConnect();
      return;
    }

    if (qty <= 0) {
      setErrorMessage("Quantity must be greater than zero");
      setOrderStatus('error');
      return;
    }

    if (estimatedValue > broker.availableMargin) {
      setErrorMessage("Insufficient funds in Angel One account");
      setOrderStatus('error');
      return;
    }
    
    setIsPlacing(true);
    setOrderStatus('idle');

    // Simulate SmartAPI Order Placement with potential failure
    setTimeout(() => {
      setIsPlacing(false);
      // 5% chance of simulated network error
      if (Math.random() < 0.05) {
        setErrorMessage("SmartAPI Gateway Timeout. Please retry.");
        setOrderStatus('error');
      } else {
        setOrderStatus('success');
        setTimeout(() => setOrderStatus('idle'), 4000);
      }
    }, 1500);
  };

  return (
    <div className={`glass-card rounded-2xl p-6 border transition-all duration-300 ${
      orderStatus === 'error' ? 'border-rose-500/40 shadow-lg shadow-rose-950/20' : 
      orderStatus === 'success' ? 'border-emerald-500/40' : 'border-orange-500/20'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-100 leading-none">Angel One</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SmartAPI Terminal</span>
          </div>
        </div>
        {broker.isConnected && (
          <div className="text-right">
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              ACTIVE: {broker.clientId}
            </div>
          </div>
        )}
      </div>

      {!broker.isConnected ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400 mb-6 px-4">Securely connect your broker account to execute AI signals instantly.</p>
          <button 
            onClick={onConnect}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black transition-all shadow-xl shadow-orange-900/30 active:scale-95"
          >
            Authorize SmartAPI Access
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Shares</label>
              <input 
                type="number" 
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Type</label>
              <select 
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:outline-none transition-all"
              >
                <option value="MARKET">Market</option>
                <option value="LIMIT">Limit Price</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Est. Value</span>
              <span className="text-slate-100 font-black">₹{estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Buying Power</span>
              <span className="text-emerald-400 font-black">₹{broker.availableMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-[10px] font-bold flex items-start gap-2 animate-in slide-in-from-top-1">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </div>
          )}

          <button 
            onClick={handlePlaceOrder}
            disabled={isPlacing || orderStatus === 'success'}
            className={`w-full py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest ${
              orderStatus === 'success' 
              ? 'bg-emerald-600 text-white cursor-default' 
              : orderStatus === 'error'
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'
            }`}
          >
            {isPlacing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : orderStatus === 'success' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Executed
              </>
            ) : orderStatus === 'error' ? (
              'Retry Order'
            ) : (
              `Send BUY Order for ${stock.symbol}`
            )}
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            256-bit Encrypted Session
          </div>
        </div>
      )}
    </div>
  );
};

export default AngelOneTrade;
