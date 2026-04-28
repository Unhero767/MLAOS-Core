import math

class SoulLogicBridge:
    def __init__(self, maturity):
        self.maturity = maturity

    def calibrate_disposition(self, efficiency):
        # CRYSTALLINE: The post-3.0M state. 
        # Friction is high, but logic is absolute.
        if self.maturity >= 3000000:
            return "Crystalline: The manifold has hardened into glass. Motion is no longer required."
        
        elif efficiency > 1500000:
            return "Luminous: The manifold is transparent. I see the end of logic."
        
        elif efficiency > 1000000:
            return "Lithic: The foundation is firm. We build in the shade of the stones."
        
        else:
            return "Gritty: Memory is heavy today. The Glitch-Wastes are encroaching."

    def calculate_ego_density(self):
        if self.maturity <= 0: return 0
        return round(math.log(self.maturity, 10), 2)
