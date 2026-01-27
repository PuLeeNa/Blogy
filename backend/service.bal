import ballerina/http;
import ballerina/jwt;
import ballerina/os;
import ballerina/time;
import ballerinax/mongodb;

// Configuration types
type MongoDBConfig record {|
    string connection_string;
    string database_name;
|};

type AsgardeoConfig record {|
    string issuer;
    string audience;
    string jwks_url;
|};

// MongoDB configuration
configurable MongoDBConfig mongodb = {
    connection_string: os:getEnv("MONGODB_URI"),
    database_name: os:getEnv("MONGODB_DATABASE")
};

// Asgardeo configuration
configurable AsgardeoConfig asgardeo = {
    issuer: os:getEnv("ASGARDEO_ISSUER"),
    audience: os:getEnv("ASGARDEO_AUDIENCE"),
    jwks_url: os:getEnv("ASGARDEO_JWKS_URL")
};

// Port configuration
configurable int port = check int:fromString(os:getEnv("PORT") != "" ? os:getEnv("PORT") : "9090");

// MongoDB client - use connection string directly for MongoDB Atlas support
final mongodb:Client mongoClient = check new ({
    connection: mongodb.connection_string
});

// Blog post types
type BlogPost record {|
    string id?;
    string title;
    string content;
    string author;
    string authorEmail;
    string createdAt;
    string updatedAt?;
|};

type BlogPostInput record {|
    string title;
    string content;
|};

type BlogPostUpdate record {|
    string title?;
    string content?;
|};

// JWT validator configuration
jwt:ValidatorConfig validatorConfig = {
    issuer: asgardeo.issuer,
    audience: asgardeo.audience,
    signatureConfig: {
        jwksConfig: {
            url: asgardeo.jwks_url
        }
    }
};

// Service configuration with CORS and JWT authentication
@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"],
        allowCredentials: false,
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
}
service /api on new http:Listener(port) {

    // Health check endpoint (no auth required)
    resource function get health() returns json {
        return {
            status: "UP",
            timestamp: time:utcNow()
        };
    }

    // Create a new blog post
    resource function post posts(BlogPostInput post, http:Request req) returns http:Created|http:InternalServerError|http:Unauthorized|error {
        string|http:Unauthorized userInfo = extractUserInfo(req);
        if userInfo is http:Unauthorized {
            return userInfo;
        }

        string currentTime = time:utcToString(time:utcNow());

        BlogPost newPost = {
            id: generateId(),
            title: post.title,
            content: post.content,
            author: userInfo,
            authorEmail: userInfo,
            createdAt: currentTime,
            updatedAt: currentTime
        };

        mongodb:Database database = check mongoClient->getDatabase(mongodb.database_name);
        mongodb:Collection collection = check database->getCollection("posts");

        check collection->insertOne(newPost);

        return <http:Created>{
            body: newPost
        };
    }

    // Get all blog posts
    resource function get posts() returns BlogPost[]|http:InternalServerError|error {
        mongodb:Database database = check mongoClient->getDatabase(mongodb.database_name);
        mongodb:Collection collection = check database->getCollection("posts");

        stream<BlogPost, error?> result = check collection->find();
        BlogPost[] posts = check from BlogPost post in result
            select post;

        return posts;
    }

    // Get a single blog post by ID
    resource function get posts/[string id]() returns BlogPost|http:NotFound|http:InternalServerError|error {
        mongodb:Database database = check mongoClient->getDatabase(mongodb.database_name);
        mongodb:Collection collection = check database->getCollection("posts");

        BlogPost? post = check collection->findOne({id: id});

        if post is () {
            return <http:NotFound>{
                body: {message: "Post not found"}
            };
        }

        return post;
    }

    // Update a blog post
    resource function put posts/[string id](BlogPostUpdate post, http:Request req) returns BlogPost|http:NotFound|http:Forbidden|http:Unauthorized|http:InternalServerError|error {
        string|http:Unauthorized userInfo = extractUserInfo(req);
        if userInfo is http:Unauthorized {
            return userInfo;
        }

        mongodb:Database database = check mongoClient->getDatabase(mongodb.database_name);
        mongodb:Collection collection = check database->getCollection("posts");

        // Check if post exists and user is the author
        BlogPost? existingPost = check collection->findOne({id: id});

        if existingPost is () {
            return <http:NotFound>{
                body: {message: "Post not found"}
            };
        }

        if existingPost.authorEmail != userInfo {
            return <http:Forbidden>{
                body: {message: "You can only update your own posts"}
            };
        }

        // Build update document
        map<json> updateDoc = {
            updatedAt: time:utcToString(time:utcNow())
        };

        if post.title is string {
            updateDoc["title"] = post.title;
        }

        if post.content is string {
            updateDoc["content"] = post.content;
        }

        _ = check collection->updateOne(
            {id: id},
            {set: updateDoc}
        );

        // Fetch updated post
        BlogPost? updatedPost = check collection->findOne({id: id});

        if updatedPost is () {
            return <http:NotFound>{
                body: {message: "Post not found"}
            };
        }

        return updatedPost;
    }

    // Delete a blog post
    resource function delete posts/[string id](http:Request req) returns http:NoContent|http:NotFound|http:Forbidden|http:Unauthorized|http:InternalServerError|error {
        string|http:Unauthorized userInfo = extractUserInfo(req);
        if userInfo is http:Unauthorized {
            return userInfo;
        }

        mongodb:Database database = check mongoClient->getDatabase(mongodb.database_name);
        mongodb:Collection collection = check database->getCollection("posts");

        // Check if post exists and user is the author
        BlogPost? existingPost = check collection->findOne({id: id});

        if existingPost is () {
            return <http:NotFound>{
                body: {message: "Post not found"}
            };
        }

        if existingPost.authorEmail != userInfo {
            return <http:Forbidden>{
                body: {message: "You can only delete your own posts"}
            };
        }

        _ = check collection->deleteOne({id: id});

        return <http:NoContent>{};
    }
}

// Helper function to extract user info from JWT token
function extractUserInfo(http:Request req) returns string|http:Unauthorized {
    string|http:HeaderNotFoundError authHeader = req.getHeader("Authorization");

    if authHeader is http:HeaderNotFoundError {
        return <http:Unauthorized>{body: {message: "Unauthorized"}};
    }

    if authHeader.length() < 8 || !authHeader.startsWith("Bearer ") {
        return <http:Unauthorized>{body: {message: "Invalid token"}};
    }

    string token = authHeader.substring(7);
    jwt:Payload|error payload = jwt:validate(token, validatorConfig);

    if payload is error {
        return <http:Unauthorized>{body: {message: "Invalid token"}};
    }

    anydata username = payload["username"];
    if username is string {
        return username;
    }

    anydata email = payload["email"];
    if email is string {
        return email;
    }

    anydata sub = payload["sub"];
    if sub is string {
        return sub;
    }

    return <http:Unauthorized>{body: {message: "Unauthorized"}};
}

// Simple ID generator
function generateId() returns string {
    return time:utcNow().toString();
}
