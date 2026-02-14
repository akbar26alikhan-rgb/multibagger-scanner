
import numpy as np

def clip(val):
    return min(100, max(0, val))

def calculate_stock_scores(fundamentals, technicals):
    # Simplified Logic matching the factor model requested
    
    # 1. BUSINESS QUALITY (20%)
    roce_score = 100 if fundamentals['roce'] >= 25 else 80 if fundamentals['roce'] >= 20 else 60 if fundamentals['roce'] >= 15 else 40 if fundamentals['roce'] >= 10 else 0
    margin_trend = 100 if fundamentals['margin_trend'] == 'increasing' else 70 if fundamentals['margin_trend'] == 'stable' else 30
    cfo_pat = 100 if fundamentals['cfo_pat'] >= 1 else 70 if fundamentals['cfo_pat'] >= 0.8 else 40 if fundamentals['cfo_pat'] >= 0.6 else 0
    asset_turnover = 100 if fundamentals['asset_trend'] == 'improving' else 60 if fundamentals['asset_trend'] == 'stable' else 20
    
    business_quality = clip(0.35*roce_score + 0.20*margin_trend + 0.30*cfo_pat + 0.15*asset_turnover)

    # 2. FINANCIAL STRENGTH (15%)
    debt_score = 100 if fundamentals['debt_equity'] < 0.3 else 80 if fundamentals['debt_equity'] < 0.6 else 50 if fundamentals['debt_equity'] <= 1 else 0
    interest_score = 100 if fundamentals['interest_cov'] > 6 else 80 if fundamentals['interest_cov'] > 4 else 60 if fundamentals['interest_cov'] > 3 else 20
    reserve_growth = 100 if fundamentals['reserve_growth'] > 15 else 70 if fundamentals['reserve_growth'] > 5 else 40 if fundamentals['reserve_growth'] > 0 else 0
    dilution = 100 if not fundamentals['dilution'] else 30
    
    financial_strength = clip(0.35*debt_score + 0.25*interest_score + 0.25*reserve_growth + 0.15*dilution)

    # ... and so on for Growth, Smart Money, Price Discovery ...
    # This structure mirrors the TypeScript implementation for consistency.
    
    total_score = 0.20*business_quality + 0.15*financial_strength + 0.25*25 + 0.20*20 + 0.20*20 # Placeholder
    
    return {
        "total": total_score,
        "categories": {
            "business": business_quality,
            "financial": financial_strength
        }
    }
