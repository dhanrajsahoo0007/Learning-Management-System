#!/bin/bash

API_URL="http://localhost:2358"
SLEEP_TIME=2

echo "Testing Judge0 at $API_URL..."

# Helper function to submit and get result
run_test() {
    LANG_ID=$1
    SOURCE=$2
    NAME=$3

    echo -n "Testing $NAME (ID: $LANG_ID)... "

    # 1. Submit
    RESPONSE=$(curl -s -X POST "$API_URL/submissions/?base64_encoded=false&wait=false" \
        -H "Content-Type: application/json" \
        -d "{
            \"source_code\": \"$SOURCE\",
            \"language_id\": $LANG_ID
        }")
    
    TOKEN=$(echo $RESPONSE | jq -r '.token')

    if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
        echo "FAILED (Submission error)"
        echo $RESPONSE
        return
    fi

    # 2. Poll
    for i in {1..10}; do
        sleep $SLEEP_TIME
        RESULT=$(curl -s "$API_URL/submissions/$TOKEN?base64_encoded=false")
        STATUS=$(echo $RESULT | jq -r '.status.id')
        
        # 3 = Accepted
        if [ "$STATUS" == "3" ]; then
            OUTPUT=$(echo $RESULT | jq -r '.stdout')
            if [[ "$OUTPUT" == *"Hello"* ]]; then
                 echo "SUCCESS -> Output: $(echo $OUTPUT | tr -d '\n')"
            else
                 echo "FAILED -> Unexpected Output: $OUTPUT"
            fi
            return
        fi

        # > 3 means error
        if [ "$STATUS" -gt 3 ]; then
             ERR=$(echo $RESULT | jq -r '.status.description')
             echo "FAILED -> Status: $ERR"
             return
        fi
    done

    echo "TIMEOUT"
}

# Python (ID 71)
run_test 71 "print('Hello Python')" "Python"

# JavaScript (ID 63)
run_test 63 "console.log('Hello JavaScript')" "JavaScript"

# Java (ID 62)
# Note: Java requires class name matching or public class
run_test 62 "public class Main { public static void main(String[] args) { System.out.println(\"Hello Java\"); } }" "Java"

# C++ (ID 54)
run_test 54 "#include <iostream>\nint main() { std::cout << \"Hello C++\"; return 0; }" "C++"
