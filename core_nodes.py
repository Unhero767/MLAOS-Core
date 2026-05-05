class Node:
    def __init__(self, data): 
        self.data = data
        self.speed = data.get('speed', 0.5)
    @staticmethod
    def load(s): return Node({'id': s, 'speed': 0.5})
    def fossilize(self): return str(self.data)
