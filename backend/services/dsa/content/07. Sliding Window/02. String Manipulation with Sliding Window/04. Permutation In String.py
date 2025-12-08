"""
Question:
Given an array of integers representing different types of fruits, 
you are asked to pick fruits in baskets such that:
- You can only pick two different types of fruits at a time.
- You want to collect the maximum number of fruits in a row.

Return the maximum number of fruits you can collect.

Test Cases:
Input: [1,2,1] → Output: 3
Input: [0,1,2,2] → Output: 3
Input: [1,2,3,2,2] → Output: 4
Input: [3,3,3,1,2,1,1,2,3,3,4] → Output: 5
"""

from collections import defaultdict


class FruitBasket:
    def total_fruit_solution1(self, fruits):
        """
        Plain-English Steps:
        1) Walk from left to right and keep a running stretch of trees you’re taking fruit from.
        2) Keep a small tally of how many fruits of each kind are inside the stretch.
        3) If you ever carry more than two kinds, move the left edge forward one tree at a time
           until only two kinds remain.
        4) After the stretch is valid (two kinds or fewer), record its length as a candidate answer.
        5) Continue to the end and keep the largest length you ever saw.

        Time Complexity: O(2n)
            - Each tree enters the stretch once and leaves it at most once as we move the edges.
        Space Complexity: O(1)
            - The tally stores counts for at most three kinds at any moment, which is a fixed bound.

        Returns:
            The longest number of fruits you can collect in a row using at most two kinds.
        """
        l = 0
        max_len = 0
        mpp = defaultdict(int)   # fruit type → count in current stretch

        for r in range(len(fruits)):
            mpp[fruits[r]] += 1

            # Too many kinds? shrink from the left until valid
            while len(mpp) > 2:
                mpp[fruits[l]] -= 1
                if mpp[fruits[l]] == 0:
                    del mpp[fruits[l]]
                l += 1

            # valid stretch (≤ 2 kinds) — update best answer
            if len(mpp) <= 2:
                max_len = max(max_len, r - l + 1)

        return max_len

    def total_fruit_solution2(self, fruits):
        """
        Plain-English Steps (Single-Loop Variant):
        1) Move from left to right, growing your stretch.
        2) Add the current tree’s fruit to the tally.
        3) If you now have more than two kinds, nudge the left edge forward by one tree
           (remove that one tree from the tally). If it’s still too many, you’ll nudge again
           on the next step — we only do one nudge per step in this version.
        4) Only when the stretch has two kinds or fewer do we consider its length for the answer.
        5) Keep the largest length seen along the way.

        Time Complexity: O(n)
            - Even with “one nudge per step,” both edges together still move at most n times.
        Space Complexity: O(1)
            - The tally keeps counts for at most three kinds, which is a fixed bound.

        Returns:
            The longest number of fruits you can collect in a row using at most two kinds.
        """
        l = 0
        max_len = 0
        mpp = defaultdict(int)

        for r in range(len(fruits)):
            mpp[fruits[r]] += 1  # include current fruit

            # If we have more than two kinds, shrink once this step
            if len(mpp) > 2:
                mpp[fruits[l]] -= 1
                if mpp[fruits[l]] == 0:
                    del mpp[fruits[l]]
                l += 1

            # consider answer only when the stretch is valid
            if len(mpp) <= 2:
                max_len = max(max_len, r - l + 1)

        return max_len


if __name__ == "__main__":
    fruits_test_cases = [
        [1, 2, 1],
        [0, 1, 2, 2],
        [1, 2, 3, 2, 2],
        [3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4],
    ]

    basket = FruitBasket()

    print("Solution 1 Results:")
    for fruits in fruits_test_cases:
        print(f"Input: {fruits} → Output: {basket.total_fruit_solution1(fruits)}")

    print("\nSolution 2 Results:")
    for fruits in fruits_test_cases:
        print(f"Input: {fruits} → Output: {basket.total_fruit_solution2(fruits)}")
