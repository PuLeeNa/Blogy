import ballerina/time;

// Simple ID generator
public function generateId() returns string {
    return time:utcNow().toString();
}

// Get current timestamp as string
public function getCurrentTimestamp() returns string {
    return time:utcToString(time:utcNow());
}
