
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def fetch_screener_data(symbol: str):
    """
    Fetches key fundamental ratios for an Indian stock symbol from Screener.in
    Note: Real production scrapers should handle headers and rotating proxies.
    """
    url = f"https://www.screener.in/company/{symbol}/consolidated/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        ratios = {}
        
        # Extract ratios from the top summary cards
        top_ratios = soup.find('ul', id='top-ratios')
        if top_ratios:
            for li in top_ratios.find_all('li'):
                name_span = li.find('span', class_='name')
                value_span = li.find('span', class_='number')
                if name_span and value_span:
                    name = name_span.text.strip().lower()
                    val_str = value_span.text.strip().replace(',', '')
                    try:
                        val = float(val_str)
                        ratios[name] = val
                    except ValueError:
                        continue
        
        # Mapping Screener names to our internal schema
        mapping = {
            'market cap': 'marketCap',
            'roce': 'roce',
            'roe': 'roe',
            'debt to equity': 'debtEquity',
            'promoter holding': 'promoterHolding',
            'pledged percentage': 'pledge',
            'interest coverage': 'interestCoverage',
            'sales growth 3years': 'revenueGrowth3Y',
            'profit growth 3years': 'profitGrowth3Y',
            'stock p/e': 'pe'
        }
        
        result = {}
        for scr_name, our_name in mapping.items():
            result[our_name] = ratios.get(scr_name, 0.0)
            
        return result
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None

# Simple cache to avoid hitting Screener too hard
_cache = {}

def get_real_fundamentals(symbol: str):
    if symbol in _cache and (time.time() - _cache[symbol]['ts'] < 86400):
        return _cache[symbol]['data']
    
    data = fetch_screener_data(symbol)
    if data:
        _cache[symbol] = {'data': data, 'ts': time.time()}
    return data
