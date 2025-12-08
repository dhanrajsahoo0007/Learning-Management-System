"""
Rod Cutting Problem using Knapsack Solution

Problem Statement:
    Given a rod of length n inches and a table of prices pi for i = 1, 2, ..., n, determine the maximum revenue rn obtainable by cutting up the rod and selling the pieces.

For example:
    length   | 1   2   3   4   5   6   7   8  
    --------------------------------------------
    price    | 1   5   8   9  10  17  17  20

    If length of rod is 8 and the values of different pieces are as given above,
    then the maximum obtainable value is 22 (by cutting in two pieces of lengths 2 and 6)

Approach:
    1. We'll adapt the given knapsack function to solve the Rod Cutting problem.
    2. In this context:
        - The "weight" (W) is the length of the rod.
        - The "weights" (wt) are the possible cut lengths.
        - The "values" (val) are the prices for each length.
    3. We'll use a bottom-up dynamic programming approach.

Key Points:
    Unbounded Nature: We can use each "item" (cut length) multiple times.

Explanation:

    1. We adapt the knapsack function to solve the Rod Cutting problem:
    - The "weight capacity" (W) becomes the length of the rod.
    - The "weights" (wt) are the possible cut lengths [1, 2, 3, ..., n].
    - The "values" (val) are the prices for each length.

    2. We create a 2D table K where K[i][w] represents the maximum value obtainable for length w considering the first i possible cut lengths.

    3. We fill the table in a bottom-up manner:
    - If the current cut length (wt[i-1]) is less than or equal to the current length being considered (w), we have two choices:
        a) Include this cut: val[i-1] + K[i][w-wt[i-1]]
        b) Exclude this cut: K[i-1][w]
        We take the maximum of these two.
    - If the current cut length is greater than the current length, we can't use this cut, so we take the value from the previous row.

    4. The final answer is in K[n][length], which represents the maximum value obtainable for the full rod length considering all possible cuts.

Time Complexity Analysis:
    - We have two nested loops:
    - The outer loop runs n times
    - The inner loop runs length times (which is also n in this case)
    - Total time complexity: O(n^2)

Space Complexity Analysis:
    - We use a 2D DP table of size (n+1) * (length+1): O(n^2)
    - Overall space complexity: O(n^2)

Code Implementation:
"""

def rod_cutting(length, prices):
    n = len(prices)
    
    # Create lists for weights (possible cut lengths) and values (prices)
    # other wise pass wt = [1, 2, 3, 4, 5] 
    wt = list(range(1, n + 1))  # [1, 2, 3, ..., n]
    
    val = prices
    
    # Initialize a table with 0's
    K = [[0 for x in range(length + 1)] for x in range(n + 1)]
    
    # Build table K[][] in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, length + 1):
            if i == 0 or w == 0:
                K[i][w] = 0
            elif wt[i-1] <= w:
                K[i][w] = max(val[i-1] + K[i][w-wt[i-1]], K[i-1][w])
            else:
                K[i][w] = K[i-1][w]
    
    return K[n][length]

# Example usage
prices = [2 ,  5 ,  9 ,  12,  13]
rod_length = len(prices)
result = rod_cutting(rod_length, prices)
print(f"Maximum obtainable value is {result}")

"""
We create a 2D table K of size (n+1) x (length+1) = 6 x 6, initialized with zeros.

DP Table Construction
====================
    able K step by step, where K[i][w] represents the maximum value obtainable for a rod of length w, considering cut lengths up to i.
    
    Step 1: Initialize first row and column with zeros (already done in initialization)
        0   1   2   3   4   5  (w: rod length)
    0   0   0   0   0   0   0
    1   0
    2   0
    3   0
    4   0
    5   0
    (i: index of the cut length being considered)
    
    Step 2: Fill for i = 1 (considering cut length 1)
        0   1   2   3   4   5
    0   0   0   0   0   0   0
    1   0   2   4   6   8   10
    2   0
    3   0
    4   0
    5   0

    Step 3: Fill for i = 2 (considering cut lengths 1 and 2)
        0   1   2   3   4   5
    0   0   0   0   0   0   0
    1   0   2   4   6   8   10
    2   0   2   5   7   10  12
    3   0
    4   0
    5   0
    
    For example, K[2][3] = max(5 + K[2][1], K[1][3]) = max(5 + 2, 6) = 7

    Step 4: Fill for i = 3 (considering cut lengths 1, 2, and 3)
        0   1   2   3   4   5
    0   0   0   0   0   0   0
    1   0   2   4   6   8   10
    2   0   2   5   7   10  12
    3   0   2   5   9   11  13
    4   0
    5   0
    
    For example, K[3][4] = max(9 + K[3][1], K[2][4]) = max(9 + 2, 10) = 11

    Step 5: Fill for i = 4 (considering cut lengths 1, 2, 3, and 4)
        0   1   2   3   4   5
    0   0   0   0   0   0   0
    1   0   2   4   6   8   10
    2   0   2   5   7   10  12
    3   0   2   5   9   11  13
    4   0   2   5   9   12  14
    5   0

    For example, K[4][5] = max(12 + K[4][1], K[3][5]) = max(12 + 2, 13) = 14

    Step 6: Fill for i = 5 (considering all cut lengths)
        0   1   2   3   4   5
    0   0   0   0   0   0   0
    1   0   2   4   6   8   10
    2   0   2   5   7   10  12
    3   0   2   5   9   11  13
    4   0   2   5   9   12  14
    5   0   2   5   9   12  14
    
    The final value K[5][5] doesn't change because using a cut of length 5 (value 13) is not better than the previous best for length 5.

Final Result
    The maximum obtainable value is in K[5][5] = 14.
    
    
Optimal Cutting Strategy
    To find the optimal cutting strategy, we trace back through the table:

    1. Start at K[5][5] = 14
    2. This value comes from K[4][5], so we don't use a cut of length 5
    3. K[4][5] = 14 comes from using a cut of length 4 (value 12) plus K[4][1] = 2
    4. K[4][1] = 2 comes from using a cut of length 1 (value 2)

    Therefore, the optimal cutting strategy is to cut the rod into two pieces:

    One piece of length 4 (value 12)
    One piece of length 1 (value 2)

    Total value: 12 + 2 = 14

"""


def reconstruct_solution(length, prices):
    n = len(prices)
    wt = list(range(1, n + 1))
    val = prices
    K = [[0 for x in range(length + 1)] for x in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, length + 1):
            if wt[i-1] <= w:
                K[i][w] = max(val[i-1] + K[i][w-wt[i-1]], K[i-1][w])
            else:
                K[i][w] = K[i-1][w]
    
    # Reconstruct the solution
    cuts = []
    i, w = n, length
    while i > 0 and w > 0:
        if K[i][w] != K[i-1][w]:
            cuts.append(wt[i-1])
            w -= wt[i-1]
        else:
            i -= 1
    
    return K[n][length], cuts

# Example usage of solution reconstruction
max_value, cutting_solution = reconstruct_solution(rod_length, prices)
print(f"Maximum value: {max_value}")
print(f"Optimal cutting solution: {cutting_solution}")

"""
This reconstruction allows us to see exactly how the rod should be cut to achieve the maximum value.

Variations and Optimizations:
1. Space Optimization: We could optimize the space to O(n) by using only two rows of the table at a time.
2. Handling Different Rod Lengths: We can easily modify the function to handle cases where the rod length is different from the number of prices given.
3. Price as a Function: Instead of a price array, we could have a price function, which might be useful for certain types of pricing models.

The knapsack approach provides a flexible framework that can be adapted to solve various related problems, demonstrating the power and versatility of dynamic programming.


Let's break down the solution reconstruction process step by step, using a small example to illustrate how it works with the DP table.
    Consider a rod of length 5 with the following prices:
    CopyLength:  1   2   3   4   5
    Price:   2   5   9   12  13

 Step 1: DP Table Construction
    First, let's look at the DP table (K) after it's been filled:

        0   1   2   3   4   5  (w: current length being considered)
    0   0   0   0   0   0   0
    1   0   2   4   6   8   10
    2   0   2   5   7   10  12
    3   0   2   5   9   11  13
    4   0   2   5   9   12  14
    5   0   2   5   9   12  14
    (i: index of the cut length being considered)

    Each cell K[i][w] represents the maximum value obtainable for a rod of length w, considering cut lengths up to i.

Step 2: Solution Reconstruction
        Now, let's go through the reconstruction code:
        We start at the bottom-right cell (i=5, w=5) and work our way backwards:

        1. Start: i=5, w=5

        K[5][5] (14) != K[4][5] (14), so we move to the next condition.
        i decreases to 4

        2. Now: i=4, w=5

        K[4][5] (14) != K[3][5] (13), so we add wt[3] (4) to cuts.
        cuts = [4]
        w decreases to 1 (5 - 4)

        3. Now: i=4, w=1

        K[4][1] (2) = K[3][1] (2), so we don't add a cut.
        i decreases to 3


        4. Now: i=3, w=1

        K[3][1] (2) = K[2][1] (2), so we don't add a cut.
        i decreases to 2


        5. Now: i=2, w=1

        K[2][1] (2) = K[1][1] (2), so we don't add a cut.
        i decreases to 1


        6. Now: i=1, w=1

        K[1][1] (2) != K[0][1] (0), so we add wt[0] (1) to cuts.
        cuts = [4, 1]
        w decreases to 0


        7. End: w=0, so the loop terminates.

Explanation of the Process

    1. We start from the bottom-right cell, which represents the optimal solution for the entire problem.
    2. At each step, we compare the current cell with the cell above it:
        If they're different, it means we used the current cut length in our solution. We add this length to our cuts list and reduce the remaining length (w) by this amount.
        If they're the same, it means we didn't use this cut length, so we move up to the previous row (decrease i).
    3. We continue this process until we've accounted for the entire rod length.

Final Result -
    The optimal cutting strategy is [4, 1], meaning we should cut the rod into pieces of length 4 and 1.
    The maximum obtainable value is 14 (K[5][5]), which comes from the prices of these cuts: 12 (for length 4) + 2 (for length 1) = 14.

"""