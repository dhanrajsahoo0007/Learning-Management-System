"""
Problem Statement:
   Fractional Knapsack Problem
   The weight of N items and their corresponding values are given. We have to put these items in a knapsack 
   of weight W such that the total value obtained is maximized.
   Note: We can either take the item as a whole or break it into smaller units.

   Example:
   Input: N = 3, W = 50, values[] = {100,60,120}, weight[] = {20,10,30}
   Output: 240.00
   Explanation: The first and second items are taken as a whole while only 20 units of the third item is taken. 
                Total value = 100 + 60 + 80 = 240.00

Explanation:
   1. Calculate the value-to-weight ratio for each item.
   2. Sort the items based on this ratio in descending order.
   3. Iterate through the sorted items:
      - If the entire item can fit, add its full value and reduce the knapsack capacity.
      - If only a fraction can fit, add the proportional value and fill the knapsack.
   4. Return the total value obtained.

Time Complexity: O(N log N), where N is the number of items.
The sorting step dominates the time complexity.

Space Complexity: O(N)
We create a list of tuples to store item information for sorting.
"""

class Solution:
   def fractionalKnapsack(self, W: int, values: list[int], weights: list[int]) -> float:
       # Create a list of (value/weight ratio, value, weight) tuples
       # [(5.0, 100, 20), (6.0, 60, 10), (4.0, 120, 30)]
       items = [(v/w, v, w) for v, w in zip(values, weights)]

       # Sort items based on value/weight ratio in descending order
       # [(6.0, 60, 10), (5.0, 100, 20), (4.0, 120, 30)]
       items.sort(reverse=True)
       
       total_value = 0
       for ratio, value, weight in items:
           if W >= weight:
               # Take the whole item
               W -= weight
               total_value += value
           else:
               # Take a fraction of the item
               total_value += ratio * W
               break  # Knapsack is full
       
       return total_value
   
"""
Explanation:
    1. Define an Item class to represent each item with its value and weight.
    2. Sort the items based on their value-to-weight ratio in descending order.
    3. Iterate through the sorted items:
       - If the entire item can fit, add its full value and increase current weight.
       - If only a fraction can fit, add the proportional value and fill the knapsack.
    4. Return the total value obtained.

Time Complexity: O(N log N), where N is the number of items.
The sorting step dominates the time complexity.

Space Complexity: O(1) if we don't consider the input array, O(N) if we do.
The sorting is done in-place, so no extra space is used apart from a few variables.
"""

class Item:
    def __init__(self, value, weight):
        self.value = value
        self.weight = weight

class Solution2:
    def fractionalKnapsack2(self, W, arr, n):
        # Sort items by value-to-weight ratio in descending order
        arr.sort(key=lambda x: x.value / x.weight, reverse=True)
        
        curWeight = 0
        finalvalue = 0.0
        
        for i in range(n):
            if curWeight + arr[i].weight <= W:
                # Take the whole item
                curWeight += arr[i].weight
                finalvalue += arr[i].value
            else:
                # Take a fraction of the item
                remain = W - curWeight
                finalvalue += arr[i].value / arr[i].weight * remain
                break
        
        return finalvalue
    

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    # Test case
    N = 3
    W = 50
    values = [100, 60, 120]
    weights = [20, 10, 30]

    result = solution.fractionalKnapsack(W, values, weights)
    print(f"Input: N = {N}, W = {W}")
    print(f"values[] = {values}")
    print(f"weights[] = {weights}")
    print(f"Output: {result:.2f}")
    n = 3
    W = 50
    arr = [Item(60, 10), Item(100, 20), Item(120, 30)]
    obj = Solution2()
    ans = obj.fractionalKnapsack2(W, arr, n)
    print("The maximum value is", ans)