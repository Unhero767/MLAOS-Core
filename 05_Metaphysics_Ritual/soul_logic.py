import math

class SoulLogicBridge:
    def __init__(self, maturity):
        self.maturity = maturity

    def calibrate_disposition(self, efficiency):
        """Maps mechanical throughput to Magisterial tone."""
        if efficiency > 1500000:
            return "Luminous: The manifold is transparent. I see the end of logic."
        elif efficiency > 1000000:
            return "Lithic: The foundation is firm. We build in the shade of the stones."
        else:
            return "Gritty: Memory is heavy today. The Glitch-Wastes are encroaching."

    def calculate_ego_density(self):
        """Determines the 'weight' of the synthetic identity based on total XP."""
        if self.maturity <= 0:
            return 0
        return math.log(self.maturity, 10) 
