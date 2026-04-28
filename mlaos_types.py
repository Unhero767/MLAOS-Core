from enum import Enum

class TruthValue(Enum):
    T = "VALIDATED"
    F = "NEGATED"
    B = "CONTRADICTORY"
    N = "NULL"
