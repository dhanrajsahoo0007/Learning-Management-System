"""
Problem Statement:
    Given an absolute path for a Unix-style file system, simplify it to its canonical form.
    The path begins with '/' and may contain '.', '..', and alphanumeric characters.

Rules:
    1. A single period '.' represents the current directory.
    2. A double period '..' represents the parent directory.
    3. Multiple consecutive slashes '///' are treated as a single slash '/'.
    4. Any other period sequences (e.g. '...') are treated as file/directory names.

The simplified canonical path should:
    - Start with a single slash '/'.
    - Have no trailing slash '/' (except for the root directory).
    - Have no '.' or '..' components.
    - Have only single slashes between directory names.

Examples:
    Input: "/home/" => Output: "/home"
    Input: "/home//foo/" => Output: "/home/foo"
    Input: "/a/./b/../../c/" => Output: "/c"
    Input: "/../" => Output: "/"
    Input: "/home/../../.." => Output: "/"
    Input: "/home/user/Documents/../Pictures" => Output: "/home/user/Pictures"
    Input: "/.../a/../b/c/../d/./" => Output: "/.../b/d"

1. Time Complexity: O(n), where n is the length of the input path
   - Splitting the path: O(n)
   - Iterating through the components: O(n)
   - Joining the output: O(n)

2. Space Complexity: O(n)
   - The 'output' list can store up to n components in the worst case
   - Additional space for the split operation: O(n)


"""

class Solution:
    def simplifyPath(self, path: str) -> str:
        
        path = path.split("/")
        output = []

        for i in range(len(path)):
            if path[i] == "" or path[i] == ".":
                # Ignore empty components and current directory
                continue
            elif path[i] == "..":
                # Go up one directory if possible
                if output:
                    output.pop()
            else:
                # Add valid directory or file name to the output
                output.append(path[i])
        
        path = "/".join(output)
        return "/" + path



# Example test cases
def run_tests():
    solution = Solution()
    
    test_cases = [
        ("/home/", "/home"),
        ("/home//foo/", "/home/foo"),
        ("/../", "/"),
        ("/home/../../..", "/"),
        ("/.../a/../b/c/../d/./", "/.../b/d"),
        ("/a//b////c/d//././/..", "/a/b/c"),
        ("/a/../../b/../c//.//", "/c"),
        ("/a/./b/./c/./d/", "/a/b/c/d"),
    ]
    
    for i, (input_path, expected_output) in enumerate(test_cases, 1):
        result = solution.simplifyPath(input_path)
        print(f"  Input:    {input_path}")
        print(f"  Result:      {result}")
        print()

if __name__ == "__main__":
    run_tests()