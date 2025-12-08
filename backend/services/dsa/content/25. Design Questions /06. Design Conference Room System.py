"""
Design a Conference Room Booking System
Create a system to manage the booking of a single conference room.
The system should include a method book(start, end) which is called with a time interval,
 represented by its start and end times.
 The book method should check if the room is available during the specified interval. If the room is available (i.e., the requested interval does not overlap with any previously booked intervals), the method should book the room for that time, store the interval, and return true. If the room is not available (i.e., there is an overlap with a previously booked interval), the method should return false.
Example:
book(10, 20) returns true (The room is booked from time 10 to 20)
book(20, 30) returns true (The room is booked from time 20 to 30, 
note that booking at the exact end time of another booking is allowed)
book(5, 15) returns false (This request overlaps with the first booking from 10 to 20)
Additional Test Cases:
book(15, 25) returns false (This interval overlaps with the time interval from 10 to 20)
book(25, 35) returns false (There is no overlap with any existing booking)
book(1, 5) returns true (This booking is before the first booking and does not overlap)
book(30, 40) returns true (This booking starts exactly at the end of the second booking and does not overlap)
Each booking is determined solely on the availability of the room during 
the specified time interval without considering other factors such as setup or cleanup times.
"""