class Manifold:
    def __init__(self, cap, anchor): self.cap = cap; self.jovian_anchor = anchor
    @staticmethod
    def anchor(s): return Manifold(cap=1.0, anchor=True)
