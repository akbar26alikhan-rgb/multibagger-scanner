
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle
import os

# Features used for the model
FEATURES = [
    'revenueGrowth3Y', 'profitGrowth3Y', 'roce', 'roe', 'margin', 
    'debtEquity', 'interestCoverage', 'promoterHolding', 'pledge',
    'rsi', 'return6M', 'volumeRatio'
]

class MultiBaggerModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = 'backend/model.pkl'
        self.scaler_path = 'backend/scaler.pkl'

    def train_mock(self):
        """Simulates training with synthetic data for demonstration"""
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic data
        X = pd.DataFrame(np.random.rand(n_samples, len(FEATURES)), columns=FEATURES)
        # Target: High ROCE + High Growth + Low Debt usually leads to outperformance (1)
        y = ((X['roce'] > 0.6) & (X['revenueGrowth3Y'] > 0.5) & (X['debtEquity'] < 0.3)).astype(int)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        self.scaler.fit(X_train)
        X_train_scaled = self.scaler.transform(X_train)
        
        self.model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            objective='binary:logistic'
        )
        self.model.fit(X_train_scaled, y_train)
        
        # Save models
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        with open(self.scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        
        print(f"Model trained. Test Accuracy: {self.model.score(self.scaler.transform(X_test), y_test)}")

    def load(self):
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(self.scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            return True
        return False

    def predict_probability(self, stock_data_dict):
        if not self.model:
            if not self.load():
                self.train_mock()
        
        # Prepare input
        df = pd.DataFrame([stock_data_dict])[FEATURES]
        scaled_data = self.scaler.transform(df)
        
        # Get probability of class 1 (Outperformer)
        prob = self.model.predict_proba(scaled_data)[0][1]
        return float(prob)

ml_engine = MultiBaggerModel()
