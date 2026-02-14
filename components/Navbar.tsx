
import React from 'react';
import { BrokerState } from '../types';

interface NavbarProps {
  broker: BrokerState;
  onConnect: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ broker, onConnect }) => {
  return (
    <nav className="glass-card sticky top-0 z-50 px-4 py-4 border-b border-slate-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Bharat <span className="text-blue-500">Scanner</span></span>
        </div>
        
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
          <a href="#" className="text-blue-400 border-b border-blue-400 pb-1">Scanner</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Broker</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Alerts</a>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onConnect}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              broker.isConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-orange-600 hover:bg-orange-500 text-white'
            }`}
          >
            {broker.isConnected ? (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Linked: {broker.clientId}
              </>
            ) : (
              'Connect Angel One'
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
