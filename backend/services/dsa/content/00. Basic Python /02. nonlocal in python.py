# used the below in n queens 
def outer():
    count = 0
    def inner():
        count += 1  # This would raise an UnboundLocalError without nonlocal
    inner()
    return count

print(outer())  # This would raise an error



def outer():
    count = 0
    def inner():
        nonlocal count
        count += 1  # Now this modifies the outer count
    inner()
    return count

print(outer())  # This correctly prints 1