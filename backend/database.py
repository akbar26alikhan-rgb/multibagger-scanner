
from sqlalchemy import create_engine, Column, Integer, Float, String, Date, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class StockMaster(Base):
    __tablename__ = 'stocks_master'
    symbol = Column(String, primary_key=True)
    name = Column(String)
    sector = Column(String)
    market_cap = Column(Float)

class PriceHistory(Base):
    __tablename__ = 'price_history'
    id = Column(Integer, primary_key=True)
    symbol = Column(String, ForeignKey('stocks_master.symbol'))
    date = Column(Date)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Integer)

class Fundamentals(Base):
    __tablename__ = 'fundamentals'
    id = Column(Integer, primary_key=True)
    symbol = Column(String, ForeignKey('stocks_master.symbol'))
    year = Column(Integer)
    revenue = Column(Float)
    profit = Column(Float)
    eps = Column(Float)
    roce = Column(Float)
    roe = Column(Float)
    margin = Column(Float)
    debt_equity = Column(Float)
    interest_coverage = Column(Float)
    reserves = Column(Float)
    promoter_holding = Column(Float)
    pledge = Column(Float)
    institutional_holding = Column(Float)

class TechnicalMetrics(Base):
    __tablename__ = 'technical_metrics'
    id = Column(Integer, primary_key=True)
    symbol = Column(String, ForeignKey('stocks_master.symbol'))
    date = Column(Date)
    rsi = Column(Float)
    macd = Column(Float)
    dma200_ratio = Column(Float)
    return_6m = Column(Float)
    volume_ratio = Column(Float)

class AIScores(Base):
    __tablename__ = 'ai_scores'
    id = Column(Integer, primary_key=True)
    symbol = Column(String, ForeignKey('stocks_master.symbol'))
    date = Column(Date)
    business_quality = Column(Float)
    financial_strength = Column(Float)
    growth_acceleration = Column(Float)
    smart_money = Column(Float)
    price_discovery = Column(Float)
    total_score = Column(Float)

def init_db(db_url="sqlite:///stock_scanner.db"):
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)
    return engine
