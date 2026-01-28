import ballerina/http;
import ballerina/time;
import ballerinax/mongodb;

// Port configuration
configurable int port = 9090;

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

    // Health check endpoint
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

        string currentTime = getCurrentTimestamp();

        BlogPost newPost = {
            id: generateId(),
            title: post.title,
            content: post.content,
            author: userInfo,
            authorEmail: userInfo,
            createdAt: currentTime,
            updatedAt: currentTime
        };

        mongodb:Collection collection = check getCollection("posts");
        check collection->insertOne(newPost);

        return <http:Created>{
            body: newPost
        };
    }

    // Get all blog posts
    resource function get posts() returns BlogPost[]|http:InternalServerError|error {
        mongodb:Collection collection = check getCollection("posts");

        stream<BlogPost, error?> result = check collection->find();
        BlogPost[] posts = check from BlogPost post in result
            select post;

        return posts;
    }

    // Get a single blog post by ID
    resource function get posts/[string id]() returns BlogPost|http:NotFound|http:InternalServerError|error {
        mongodb:Collection collection = check getCollection("posts");

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

        mongodb:Collection collection = check getCollection("posts");

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
            updatedAt: getCurrentTimestamp()
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

        mongodb:Collection collection = check getCollection("posts");

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
