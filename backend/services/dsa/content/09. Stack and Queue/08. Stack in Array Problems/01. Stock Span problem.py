"""
Problem Statement: Online Stock Span
    Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.

    The span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward)
    for which the stock price was less than or equal to the price of that day.

For example:
    1. If the prices of the stock in the last four days is [7,2,1,2] and the price of the stock today is 2, 
        then the span of today is 4 because starting from today, the price of the stock was less than or 
        equal 2 for 4 consecutive days.
    2. If the prices of the stock in the last four days is [7,34,1,2] and the price of the stock today is 8, 
        then the span of today is 3 because starting from today, the price of the stock was less than or 
        equal 8 for 3 consecutive days.

Implement the StockSpanner class:
    1. StockSpanner() Initializes the object of the class.
    2. int next(int price) Returns the span of the stock's price given that today's price is 'price'.

Constraints:
    - 1 <= price <= 10^5
    - At most 10^4 calls will be made to next.

Example:
    Input: ["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]
        [[], [100], [80], [60], [70], [60], [75], [85]]
    Output: [null, 1, 1, 1, 2, 1, 4, 6]

Explanation:
    StockSpanner stockSpanner = new StockSpanner();
    stockSpanner.next(100); // return 1
    stockSpanner.next(80);  // return 1
    stockSpanner.next(60);  // return 1
    stockSpanner.next(70);  // return 2
    stockSpanner.next(60);  // return 1
    stockSpanner.next(75);  // return 4, because the last 4 prices (including today's price of 75) were less than or equal to today's price.
    stockSpanner.next(85);  // return 6

Explanation of the solution:

    1. We initialize the StockSpanner with an empty stack.
    2. In the next() method:
        - We start with a span of 1 (the current day).
        - We pop elements from the stack while their prices are <= the current price.
        - For each popped element, we add its span to our current span.
        - We push the current (price, span) pair onto the stack.
        - We return the calculated span.

Time Complexity: 
    - O(1) amortized time complexity per call to next().
    - While a single call might take O(n) in the worst case, the overall time complexity 
      for n calls is O(n), making it O(1) amortized per call.

Space Complexity: 
    - O(n) in the worst case, where n is the number of days.
    - This occurs when the stock prices are strictly increasing.

The stack-based approach allows us to efficiently calculate the span without 
having to recalculate for every element each time, significantly improving performance.
"""

class StockSpanner:
    def __init__(self):
        # Stack to store (price, span) pairs
        self.stack = []

    def next(self, price: int) -> int:
        span = 1

        # Pop elements from stack while they have prices <= current price
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]

        # Push the current (price, span) pair onto the stack
        self.stack.append((price, span))

        return span

# Example usage
if __name__ == "__main__":
    stockSpanner = StockSpanner()
    print(stockSpanner.next(100))  # Output: 1
    print(stockSpanner.next(80))   # Output: 1
    print(stockSpanner.next(60))   # Output: 1
    print(stockSpanner.next(70))   # Output: 2
    print(stockSpanner.next(60))   # Output: 1
    print(stockSpanner.next(75))   # Output: 4
    print(stockSpanner.next(85))   # Output: 6

