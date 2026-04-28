import numpy as np

def predict_next_state(buffer, last_symbol):
    """Forecasting the next state through variance-slope analysis."""
    if len(buffer) < 10:
        return last_symbol  # Insufficient data for a burn
    
    # Calculate the variance of the current incomplete window
    current_var = np.var(buffer)
    
    # Predictive Thresholds
    if current_var < 0.15:
        return "Φ"      # High probability of Resonance
    elif current_var > 35.0:
        return "Ex∘"    # High probability of Turbulence
    else:
        return "◦A"     # High probability of Consistency

