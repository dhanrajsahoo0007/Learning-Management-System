"""
Requests for Doc Access
You are given a series of log entries that indicate the start and finish times of various requests. Each log entry consists of a timestamp and a request ID, formatted either as Start(time, reqID) or Finish(time, reqID). Your task is to process these entries to determine the start and end times for each request.
Objective:
Create an output string that lists the start and end times for each request, sorted by the finish times of the requests.
Output Format:
Output each request in the following format:
ReqID started at [start_time] and ended at [finish_time]
The requests should be listed in order of their finish times, from earliest to latest.
Constraints:
Each reqID will have exactly one Start and one Finish entry.
Time will be represented as a positive integer, and reqID will be a non-empty string.
Examples:
Input:
Start(1, req1)
Finish(2, req1)
Start(3, req2)
Start(4, req3)
Start(5, req4)
Finish(6, req4)
Finish(7, req3)
Finish(8, req2)
Output:
Req1 started at 1 and ended at 2
Req4 started at 5 and ended at 6
Req3 started at 4 and ended at 7
Req2 started at 3 and ended at 8
Input:

Start(10, req5)
Start(20, req6)
Finish(30, req5)
Finish(40, req6)
Output:
Req5 started at 10 and ended at 30
Req6 started at 20 and ended at 40
Follow-up Questions and Complex Test Cases:
How does your solution handle cases where a request's Finish log entry appears before its Start entry?
Example Input: Finish(2, req1), Start(1, req1)
Example Output: Error or -1
Can your solution process entries in real-time or does it require all entries to be present before processing?
This will test if the solution can handle stream-based input where all data might not be available upfront.
What happens if log entries are out of order?
Example Input: Start(5, req4), Finish(6, req4), Start(1, req1), Finish(2, req1)
Example Output: Req4 started at 5 and ended at 6, Req1 started at 1 and ended at 2
Implement functionality to handle missing entries (either Start or Finish).
Example Input: Start(1, req1), Start(3, req2)
Example Output: Req1 started at 1 and ended at unknown, Req2 started at 3 and ended at unknown
Test with interleaved start and finish times for multiple requests.
Example Input: Start(1, req1), Start(2, req2), Finish(3, req2), Finish(4, req1)
Example Output: Req2 started at 2 and ended at 3, Req1 started at 1 and ended at 4

"""