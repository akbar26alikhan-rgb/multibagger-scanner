
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import sys
import os

# Add parent directory to path to import other modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml_model import ml_engine
from fundamentals_fetch import get_real_fundamentals
from scoring import calculate_stock_scores

app = FastAPI(title="Bharat Multi-Bagger Scanner API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockResponse(BaseModel):
    symbol: str
    name: str
    sector: str
    marketCap: float
    totalScore: float
    aiProbability: float
    recommendation: str
    fundamentals: dict
    technicals: dict

# Mock Technicals for now (In real app, fetch from yfinance or NSE)
MOCK_TECH = {
    "price": 4950,
    "fiftyTwoWeekHigh": 5200,
    "dma200": 3800,
    "volumeRatio": 2.5,
    "return6M": 85,
    "rsi": 68
}

SYMBOLS = ["HAL", "MAZAGON", "RELIANCE", "TCS", "TITAN", "BHEL", "BEL", "TATAELXSI"]

@app.get("/api/scan", response_model=List[StockResponse])
async def scan_market():
    results = []
    for symbol in SYMBOLS:
        # 1. Fetch real fundamentals
        fundas = get_real_fundamentals(symbol)
        if not fundas:
            # Fallback for demonstration
            fundas = {
                "revenueGrowth3Y": 25, "profitGrowth3Y": 30, "roce": 28, "roe": 25, 
                "debtEquity": 0.1, "promoterHolding": 70, "pledge": 0, "interestCoverage": 20,
                "margin": 15, "margin_trend": "increasing", "cfo_pat": 1.1, "asset_trend": "improving"
            }
        
        # Ensure nested keys for scoring compatibility
        if 'margin_trend' not in fundas: fundas['margin_trend'] = 'increasing'
        if 'cfo_pat' not in fundas: fundas['cfo_pat'] = 1.0
        if 'asset_trend' not in fundas: fundas['asset_trend'] = 'improving'
        if 'dilution' not in fundas: fundas['dilution'] = False
        if 'reserve_growth' not in fundas: fundas['reserve_growth'] = 15

        # 2. Factor-based scoring
        factor_scores = calculate_stock_scores(fundas, MOCK_TECH)
        
        # 3. AI Prediction (XGBoost)
        # Flatten for ML engine
        ml_input = {**fundas, **MOCK_TECH}
        ai_prob = ml_engine.predict_probability(ml_input)
        
        # 4. Final Hybrid Score
        final_score = (0.6 * factor_scores['total']) + (0.4 * ai_prob * 100)
        
        rec = "Early Multibagger" if final_score >= 85 else "Strong Buy" if final_score >= 75 else "Watchlist"
        
        results.append({
            "symbol": symbol,
            "name": symbol + " Ltd", # Mock name expansion
            "sector": "Diversified",
            "marketCap": fundas.get('marketCap', 50000),
            "totalScore": final_score,
            "aiProbability": ai_prob * 100,
            "recommendation": rec,
            "fundamentals": fundas,
            "technicals": MOCK_TECH
        })
    
    return sorted(results, key=lambda x: x['totalScore'], reverse=True)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
