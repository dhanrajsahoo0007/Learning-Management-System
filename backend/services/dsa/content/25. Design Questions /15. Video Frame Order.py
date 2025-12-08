"""
10. Video Frame out of order


Write API's for a service which takes out of order video 
frames but forwards them in order for processing. 
Consider your services receives frames from another 
service which could be out if order but your 
service forwards them to another service always in
 sequence (based on timestamp).
After a lot of clarifying questions,
 created a class with SaveFrame()
  and GetFrame() functions using unordered_map and list. 

Discussed in length about concurrency problems 
and resolved some issues using mutexes and 
double locking approach.

"""