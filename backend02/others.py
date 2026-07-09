from math import sqrt

def es_primo(x):
    if x < 2:
        return False
    if x == 2:
        return True
    if x % 2 == 0:
        return False
    for d in range(3, int(sqrt(x)) + 1, 2):
        if x % d == 0:
            return False
    return True