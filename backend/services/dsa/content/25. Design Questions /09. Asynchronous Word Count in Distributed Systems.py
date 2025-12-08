"""
4. Asynchronous Word Count in Distributed Systems
Imagine a system consisting of n machines and n documents. Each document can be accessed by all the machines simultaneously. You are provided with the following function:
python
def countWords(machine_id, doc_id):
    return CWFuture
Where CWFuture is a class representing a future object that handles asynchronous operations related to word counting in documents. The class definition is as follows:
python
class CWFuture:
    def Join(self) -> int:
        # Blocking call that returns the total word count of the document once available.
    def IsDone(self) -> bool:
        # Non-blocking call that returns True if the word counting is completed, otherwise False.
Task: Create a function totalWordsCount(n: int) -> int that computes the total number of words across all documents using n machines.
Considerations:
How to efficiently manage asynchronous tasks using multiple machines.
Handling potential exceptions or errors (e.g., network failures).
Optimizing performance to avoid excessive waiting and ensure all machines are utilized effectively.
Extended Scenario (Follow-up): If there are more documents than machines (m < n), how would you modify the totalWordsCount function to handle this case efficiently?
Consider strategies for load balancing where each machine might process multiple documents and handle synchronization issues between different threads or processes.

Example Test Cases:
Test Case 1:
Input: n = 1 (1 machine and 1 document)
Expected Output: Assume the document contains 500 words, the function should return 500.
Test Case 2:
Input: n = 3 (3 machines and 3 documents)
Assume each document contains 300, 500, and 200 words respectively. The function should return 1000.
Test Case 3:
Input: n = 2 but only 1 machine is functional (simulating machine failure or network issue)
Assume documents contain 600 and 400 words. Depending on error handling strategies, the function might need to retry failed operations or return an error message.
Handling Asynchronous Operations:
It's crucial to consider how Join() and IsDone() methods are used to synchronize the word counting across multiple documents without causing excessive delays or deadlocks.
"""
