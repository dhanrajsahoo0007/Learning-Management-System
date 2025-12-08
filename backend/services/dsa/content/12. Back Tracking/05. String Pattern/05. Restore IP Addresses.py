"""
Problem: Restore IP Addresses

    Given a string containing only digits, find all possible valid IP addresses that can be formed
    by inserting dots into the string. Cannot reorder or remove digits.

Time Complexity: O(3^4) = O(1) because:
    - Maximum length of input is 12 (constraint)
    - For each of 4 parts, we try up to 3 digits
    - String operations are bounded by constant length

Space Complexity: O(1)
    - Maximum number of valid IPs is bounded
    - Input size is bounded by 12
"""

class Solution:
    def __init__(self):
        self.n = 0
        self.result = []
    
    def isValid(self, string: str) -> bool:
        """
        Check if the given string segment is valid:
        - No leading zeros
        - Value <= 255
        """
        if string[0] == '0':
            return False
        
        val = int(string)
        return val <= 255
    
    def solve(self, s: str, idx: int, part: int, curr: str) -> None:
        """
        Recursive function to build valid IP addresses
        
        Args:
            s: Input string
            idx: Current index in string
            part: Current part number (0-3)
            curr: Current IP being built
        """
        # Base case: if we've used all digits and have 4 parts
        if idx == self.n and part == 4:
            # Remove trailing dot and add to result
            self.result.append(curr[:-1])
            return
        
        # Try taking 1 digit
        if idx + 1 <= self.n:
            self.solve(s, idx + 1, part + 1, curr + s[idx:idx+1] + ".")
        
        # Try taking 2 digits if valid
        if idx + 2 <= self.n and self.isValid(s[idx:idx+2]):
            self.solve(s, idx + 2, part + 1, curr + s[idx:idx+2] + ".")
        
        # Try taking 3 digits if valid
        if idx + 3 <= self.n and self.isValid(s[idx:idx+3]):
            self.solve(s, idx + 3, part + 1, curr + s[idx:idx+3] + ".")
    
    def restoreIpAddresses(self, s: str) -> list[str]:
        """
        Main function to restore all possible valid IP addresses
        
        Args:
            s: Input string containing only digits
            
        Returns:
            list of all possible valid IP addresses
        """
        # Reset result list
        self.result = []
        
        # Store string length
        self.n = len(s)
        
        # Early return if string is too long
        if self.n > 12:
            return self.result
        
        # Start recursive solution
        part = 0
        curr = ""
        self.solve(s, 0, part, curr)
        
        return self.result


# Test the solution
def test_restore_ip():
    solution = Solution()
    
    # Test Case 1: Standard case
    s1 = "25525511135"
    print(f"\nTest Case 1:")
    print(f"Input: {s1}")
    print(f"Output: {solution.restoreIpAddresses(s1)}")
    
    # Test Case 2: All zeros
    s2 = "0000"
    print(f"\nTest Case 2:")
    print(f"Input: {s2}")
    print(f"Output: {solution.restoreIpAddresses(s2)}")
    
    # Test Case 3: Multiple possibilities
    s3 = "101023"
    print(f"\nTest Case 3:")
    print(f"Input: {s3}")
    print(f"Output: {solution.restoreIpAddresses(s3)}")
    
    # Test Case 4: String too long
    s4 = "1111111111111"
    print(f"\nTest Case 4:")
    print(f"Input: {s4}")
    print(f"Output: {solution.restoreIpAddresses(s4)}")
    
    # Test Case 5: Leading zeros case
    s5 = "010010"
    print(f"\nTest Case 5:")
    print(f"Input: {s5}")
    print(f"Output: {solution.restoreIpAddresses(s5)}")

if __name__ == "__main__":
    test_restore_ip()
