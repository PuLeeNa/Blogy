import ballerina/http;
import ballerina/jwt;
import ballerina/os;

// Asgardeo configuration
configurable AsgardeoConfig asgardeo = {
    issuer: os:getEnv("ASGARDEO_ISSUER"),
    audience: os:getEnv("ASGARDEO_AUDIENCE"),
    jwks_url: os:getEnv("ASGARDEO_JWKS_URL")
};

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

// Extract user info from JWT token
public function extractUserInfo(http:Request req) returns string|http:Unauthorized {
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
