"""
Problem: Boats to Save People

    You are given an array 'people' where people[i] is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of 'limit'. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most 'limit'.

    Return the minimum number of boats to carry every given person.

Constraints:
    - 1 <= people.length <= 5 * 10^4
    - 1 <= people[i] <= limit <= 3 * 10^4

Solution Explanation:
This solution uses a two-pointer approach to efficiently pair people and minimize the number of boats needed.

1. Sort the 'people' array in ascending order. This allows us to consider the lightest and heaviest people together.
2. Initialize two pointers:
   - 'left' at the start of the array (lightest person)
   - 'right' at the end of the array (heaviest person)
3. Iterate while left <= right:
   - If the sum of weights at left and right is <= limit, we can pair these two people in a boat.
   - If not, the heavier person (right) goes alone.
   - Move the right pointer left, and increment the boat count.
4. Return the total number of boats used.

Time Complexity: O(n log n) due to sorting, where n is the number of people.
Space Complexity: O(1) as we're using only a constant amount of extra space.

"""

class Solution(object):
    def numRescueBoats(self, people: list[int], limit: int) -> int:
        people.sort()  # Sort the array in ascending order
        right = len(people) - 1  # Pointer to the heaviest person
        left = res = 0  # 'left' pointer and 'res' to count boats

        while left <= right:
            if people[left] + people[right] <= limit:
                # If lightest and heaviest can go together
                left += 1  # Move the left pointer right
            right -= 1  # Always move the right pointer left
            res += 1  # Count this boat

        return res

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    # Test case 1
    people1 = [1, 2]
    limit1 = 3
    print(f"Test case 1: {solution.numRescueBoats(people1, limit1)}")
    # Expected: 1

    # Test case 2
    people2 = [3, 2, 2, 1]
    limit2 = 3
    print(f"Test case 2: {solution.numRescueBoats(people2, limit2)}")
    # Expected: 3

    # Test case 3
    people3 = [3, 5, 3, 4]
    limit3 = 5
    print(f"Test case 3: {solution.numRescueBoats(people3, limit3)}")
    # Expected: 4