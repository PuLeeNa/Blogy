// Blog post types
public type BlogPost record {|
    string id?;
    string title;
    string content;
    string author;
    string authorEmail;
    string createdAt;
    string updatedAt?;
|};

public type BlogPostInput record {|
    string title;
    string content;
|};

public type BlogPostUpdate record {|
    string title?;
    string content?;
|};

// Configuration types
public type MongoDBConfig record {|
    string connection_string;
    string database_name;
|};

public type AsgardeoConfig record {|
    string issuer;
    string audience;
    string jwks_url;
|};
