import ballerinax/mongodb;

// MongoDB configuration
configurable MongoDBConfig mongodb = ?;

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
