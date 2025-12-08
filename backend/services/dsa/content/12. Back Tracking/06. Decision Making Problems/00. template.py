# template.py

def decision_making_pattern(nums):
    def backtrack(index, decisions):
        if index == len(nums):
            if is_valid(decisions):
                result.append(decisions[:])
            return
        
        for decision in possible_decisions:
            decisions.append(decision)
            backtrack(index + 1, decisions)
            decisions.pop()

    result = []
    backtrack(0, [])
    return result