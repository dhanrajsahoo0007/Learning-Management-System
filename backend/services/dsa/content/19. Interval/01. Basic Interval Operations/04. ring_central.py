"""
Problem Statement - 

Design a user activity system which does two things 

    1. It records user activity 

    2. It generates how much total activity a particular user has performed over a period of time.

Below are the function definitions

add_user_activity(user_id: str, timestamp: int) -> None

This function records the user activity for a particular user to a particular timestamp. 

The timestamp value is Tth second. Eg: add_user_activity('user_1', 10) will add activity for user_1 at timestamp t=10 seconds

calculate_activity(user_id:str, start_timestamp: int, end_timstamp: int, frequency: Literal(minutes | hours)) -> List[dict]

This function aggregates the activity user has performed from start to end timestamp seconds as per the frequency. 

Eg:  calculate_activity('user_1', 0, 120, 'minutes') will aggregate all the activities user_1 has performed from 0 to 120 seconds aggegated minute wise
It should return timestamp frequency wise count of activities

Example

    add_user_activity('user_1',10)
    add_user_activity('user_1',12)
    add_user_activity('user_1',17)
    add_user_activity('user_1',18)
    add_user_activity('user_1',60)
    add_user_activity('user_1',65)
    add_user_activity('user_1',90)
    add_user_activity('user_1',121)
    add_user_activity('user_1', 150)


calculate_activity('user_1', 5, 130, 'minutes')

Final Output -
[
{'start': 5, 'end': 65, 'count': 6},
{'start': 65, 'end': 125, 'count': 2},
{'start': 125, 'end': 130, 'count': 0}
]
"""