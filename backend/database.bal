import ballerina/os;
import ballerinax/mongodb;

// MongoDB configuration
configurable MongoDBConfig mongodb = {
    connection_string: os:getEnv("MONGODB_URI"),
    database_name: os:getEnv("MONGODB_DATABASE")
};

// MongoDB client - use connection string directly for MongoDB Atlas support
final mongodb:Client mongoClient = check new ({
    connection: mongodb.connection_string
});

// Get database
public function getDatabase() returns mongodb:Database|error {
    return mongoClient->getDatabase(mongodb.database_name);
}

// Get collection
public function getCollection(string collectionName) returns mongodb:Collection|error {
    mongodb:Database database = check getDatabase();
    return database->getCollection(collectionName);
}
