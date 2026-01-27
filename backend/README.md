# Blog Backend - Ballerina

A REST API backend for a blog application built with Ballerina, MongoDB, and Asgardeo authentication.

## Features

- RESTful API for blog post management
- MongoDB integration for data persistence
- Asgardeo OAuth2/OIDC authentication
- User-based post ownership
- Automatic OpenAPI specification generation
- CORS enabled for frontend integration

## Prerequisites

- Ballerina 2201.9.0 or later
- MongoDB instance
- Asgardeo account and application

## Environment Variables

Set the following environment variables:

```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=blog_db
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
PORT=9090
ASGARDEO_ISSUER=https://api.asgardeo.io/t/{org_name}/oauth2/token
ASGARDEO_AUDIENCE=your-audience
ASGARDEO_JWKS_URL=https://api.asgardeo.io/t/{org_name}/oauth2/jwks
```

## API Endpoints

| Method | Endpoint        | Description              | Auth Required |
| ------ | --------------- | ------------------------ | ------------- |
| GET    | /api/health     | Health check             | No            |
| POST   | /api/posts      | Create a new post        | Yes           |
| GET    | /api/posts      | Get all posts            | Yes           |
| GET    | /api/posts/{id} | Get a specific post      | Yes           |
| PUT    | /api/posts/{id} | Update a post (own only) | Yes           |
| DELETE | /api/posts/{id} | Delete a post (own only) | Yes           |

## Running Locally

```bash
# Build the project
bal build

# Run the service
bal run
```

## Running with Docker

```bash
# Build Docker image
docker build -t blog-backend .

# Run container
docker run -p 9090:9090 \
  -e MONGODB_URI=mongodb://host:27017 \
  -e MONGODB_DATABASE=blog_db \
  -e MONGODB_USERNAME=user \
  -e MONGODB_PASSWORD=pass \
  -e ASGARDEO_ISSUER=your_issuer \
  -e ASGARDEO_AUDIENCE=your_audience \
  -e ASGARDEO_JWKS_URL=your_jwks_url \
  blog-backend
```

## Deploying to Choreo

1. Push code to a GitHub repository
2. Create a new Service component in Choreo
3. Connect your GitHub repository
4. Configure environment variables in Choreo
5. Deploy the service

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.
