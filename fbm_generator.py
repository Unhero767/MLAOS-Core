def generate_fbm(point, octaves, lacunarity, persistence):
    """
    Standard fBm summation for MLAOS-Core.
    Maintains a 1/f power spectrum across noise octaves.
    """
    value = 0.0
    amplitude = 1.0
    frequency = 1.0
    for i in range(octaves):
        # Accumulate noise octave and apply weights
        value += amplitude * noise_sample(point * frequency)
        frequency *= lacunarity
        amplitude *= persistence
    return value
