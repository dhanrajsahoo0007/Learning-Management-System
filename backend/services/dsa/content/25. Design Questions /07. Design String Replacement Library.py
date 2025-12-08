"""
 2. String Replacement Library Function Specification
Develop a string replacement function for a library that performs substitutions based on a provided map of string-to-string replacements. The function should scan an input string and replace placeholders wrapped in percentage signs (%) with corresponding values from the map.
Function Signature:
def replace_string(input_string: str, replacements: dict) -> str
Parameters:
input_string (str): The string containing placeholders that need to be replaced.
replacements (dict): A dictionary where each key is a placeholder (without percentage signs) and its corresponding value is the string to replace it with.
Return Value:
Returns a string with all placeholders replaced by their respective values from the replacements dictionary.
Examples and Expected Outputs:
Basic Replacement:
Replacements Map: {'X': '123', 'Y': '456'}
Input String: '%X%_%Y%'
Expected Output: '123_456'
Recursive Replacement:
Replacements Map: {'USER': 'admin', 'HOME': '/%USER%/home'}
Input String: 'I am %USER% My home is %HOME%'
Expected Output: 'I am admin My home is /admin/home'
Complex Recursive Replacement:
Replacements Map: {'A': '%B%', 'B': '%C%', 'C': 'success'}
Input String: 'Process: %A%'
Expected Output: 'Process: success' (after resolving B and C recursively)
Unmatched Placeholders:
Replacements Map: {'NAME': 'John'}
Input String: 'Hello, %NAME%! Meet %UNKNOWN%.'
Expected Output: 'Hello, John! Meet %UNKNOWN%.' (Note that '%UNKNOWN%' remains unchanged)
No Placeholders:
Replacements Map: {'X': '123'}
Input String: 'Hello, World!'
Expected Output: 'Hello, World!' (No changes made as there are no placeholders)
             Follow Up Question( from a candidate):
Consider a scenario where your dictionary containing variables includes nested variables.
For instance:
input = "Hi %USER%", {USER: "%PRONOUN% John", PRONOUN: "Mr."}
I suggested a recursive approach to the function to derive the final string. The interviewer acknowledged this as acceptable, but also mentioned an alternative method: flattening the variable dictionary prior to modifying the original string.
Constraints:
Placeholders in the input string are always wrapped in percentage signs (%).
If a placeholder in the input string does not have a corresponding entry in the replacement map, it should remain unchanged in the output.
The function should handle nested or recursive placeholders as seen in the second example.
"""