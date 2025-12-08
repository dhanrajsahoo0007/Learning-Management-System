"""
Calculating Minimum Car Fleet Requirements
You are given a list of rental log entries for cars from different companies. Each entry includes a start time and an end time, which represent when a car is picked up and when it is returned, respectively. Your task is to determine the minimum number of cars that the company needs to have available at any point in time to satisfy all rental requests based on these logs.
Objective:
Calculate the minimum number of cars required to ensure that all rental demands can be met simultaneously, if needed.
Test Cases:
Simple Case:
Input: [(1, 4), (2, 5), (7, 9)]
Expected Output: 2
Explanation: Two cars are required between times 2 to 4 to manage the overlapping rentals.
Overlapping Rentals:
Input: [(1, 3), (2, 6), (3, 5)]
Expected Output: 3
Explanation: Each rental overlaps with at least one other, necessitating three cars.
Non-Overlapping Rentals:
Input: [(1, 2), (3, 4), (5, 6)]
Expected Output: 1
Explanation: There is no overlap among the rentals, so one car can be used sequentially for all.
Complex Overlapping:
Input: [(1, 5), (2, 3), (6, 9), (4, 7)]
Expected Output: 3
Explanation: A maximum of three rentals overlap between times 4 to 5, requiring three cars.

"""