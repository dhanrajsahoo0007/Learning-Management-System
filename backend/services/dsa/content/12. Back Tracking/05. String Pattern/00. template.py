# template.py



def string_building_pattern(n):
    def backtrack(index, current):
        if index == n:
            result.append(current)
            return
        
        for char in possible_chars:
            backtrack(index + 1, current + char)

    result = []
    possible_chars = ['a', 'b', 'c']  # Example set of characters
    backtrack(0, '')
    return result