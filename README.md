# Blog Application

A full-stack blog application built with Ballerina, React, MongoDB, and Asgardeo authentication, designed for deployment on WSO2 Choreo.

## Features

- 🔐 Secure authentication with Asgardeo (OAuth2/OIDC)
- 📝 Create, read, update, and delete blog posts
- 👤 User-based post ownership
- 🎨 Simple and clean UI
- 🐳 Docker containerization
- ☁️ Choreo-ready deployment

## Tech Stack

**Backend**:

- Ballerina - REST API framework
- MongoDB - Database
- Asgardeo - Authentication/Authorization

**Frontend**:

- React - UI framework
- Asgardeo Auth React SDK - Authentication

**DevOps**:

- Docker - Containerization
- Docker Compose - Local orchestration
- WSO2 Choreo - Cloud deployment platform

## Project Structure

```
.
├── backend/                 # Ballerina backend service
│   ├── service.bal         # Main service implementation
│   ├── Ballerina.toml      # Ballerina project config
│   ├── Config.toml         # Configuration template
│   ├── Dockerfile          # Backend Docker image
│   └── README.md           # Backend documentation
│
├── frontend/               # React frontend application
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── App.js        # Main application component
│   │   ├── index.js      # Entry point with auth provider
│   │   └── index.css     # Styles
│   ├── nginx.conf         # Nginx configuration
│   ├── Dockerfile         # Frontend Docker image
│   ├── package.json       # Node dependencies
│   └── README.md          # Frontend documentation
│
├── docker-compose.yml     # Local development orchestration
├── .env.example           # Environment variables template
├── DEPLOYMENT.md          # Choreo deployment guide
└── README.md              # This file
```

## Quick Start

### Prerequisites

- [Ballerina](https://ballerina.io/downloads/) 2201.9.0+
- [Node.js](https://nodejs.org/) 16+
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [MongoDB](https://www.mongodb.com/) (or MongoDB Atlas account)
- [Asgardeo](https://wso2.com/asgardeo/) account

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Project

# Option 1: Use setup wizard (recommended)
./setup.sh          # Linux/Mac
setup.bat           # Windows

# Option 2: Manual setup
cp .env.example .env
# Edit .env with your configuration
```

### 2. Configure Asgardeo

1. Create an Asgardeo account at https://console.asgardeo.io/
2. Create a new Single Page Application
3. Configure:
   - Authorized redirect URLs: `http://localhost:3000`
   - Allowed grant types: Code, Refresh Token
   - Enable public client
4. Note your Client ID, Issuer, and JWKS URL
5. Update `.env` with your Asgardeo credentials

### 3. Run with Docker Compose

```bash
# Update .env with your Asgardeo credentials
# Then start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

This starts:

- MongoDB on port 27017
- Backend API on port 9090
- Frontend on port 3000

Visit http://localhost:3000 to use the application.

### 4. Run Locally (Without Docker)

**Backend**:

```bash
cd backend

# Set environment variables
export MONGODB_URI="mongodb://localhost:27017"
export MONGODB_DATABASE="blog_db"
export MONGODB_USERNAME="admin"
export MONGODB_PASSWORD="password"
export ASGARDEO_ISSUER="your-issuer"
export ASGARDEO_AUDIENCE="your-audience"
export ASGARDEO_JWKS_URL="your-jwks-url"
export PORT="9090"

# Run the service
bal run
```

**Frontend**:

```bash
cd frontend

# Copy and configure environment
cp .env.example .env
# Edit .env with your values

# Install and run
npm install
npm start
```

## API Documentation

### Backend Endpoints

| Method | Endpoint          | Description              | Auth |
| ------ | ----------------- | ------------------------ | ---- |
| GET    | `/api/health`     | Health check             | No   |
| POST   | `/api/posts`      | Create post              | Yes  |
| GET    | `/api/posts`      | Get all posts            | Yes  |
| GET    | `/api/posts/{id}` | Get post by ID           | Yes  |
| PUT    | `/api/posts/{id}` | Update post (owner only) | Yes  |
| DELETE | `/api/posts/{id}` | Delete post (owner only) | Yes  |

### Blog Post Schema

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "author": "string",
  "authorEmail": "string",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

## Deployment to Choreo

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to WSO2 Choreo.

Quick summary:

1. Set up MongoDB (Atlas recommended)
2. Configure Asgardeo application
3. Deploy backend as Choreo Service
4. Deploy frontend as Choreo Web Application
5. Update Asgardeo redirect URLs with Choreo URLs
6. Test and verify

## Development

### Backend Development

```bash
cd backend

# Run in watch mode (auto-reload on changes)
bal run --observability-included

# Build
bal build

# Run tests (if you add them)
bal test
```

### Frontend Development

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Docker Development

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild and restart a service
docker-compose up -d --build [service-name]
```

## Environment Variables

### Backend

| Variable            | Description               | Example                                      |
| ------------------- | ------------------------- | -------------------------------------------- |
| `PORT`              | Server port               | `9090`                                       |
| `MONGODB_URI`       | MongoDB connection string | `mongodb://localhost:27017`                  |
| `MONGODB_DATABASE`  | Database name             | `blog_db`                                    |
| `MONGODB_USERNAME`  | MongoDB username          | `admin`                                      |
| `MONGODB_PASSWORD`  | MongoDB password          | `password`                                   |
| `ASGARDEO_ISSUER`   | Asgardeo token issuer     | `https://api.asgardeo.io/t/org/oauth2/token` |
| `ASGARDEO_AUDIENCE` | Expected token audience   | `client-id`                                  |
| `ASGARDEO_JWKS_URL` | JWKS endpoint             | `https://api.asgardeo.io/t/org/oauth2/jwks`  |

### Frontend

| Variable                                   | Description        | Example                         |
| ------------------------------------------ | ------------------ | ------------------------------- |
| `REACT_APP_ASGARDEO_CLIENT_ID`             | Asgardeo client ID | `abc123...`                     |
| `REACT_APP_ASGARDEO_BASE_URL`              | Asgardeo base URL  | `https://api.asgardeo.io/t/org` |
| `REACT_APP_ASGARDEO_SIGN_IN_REDIRECT_URL`  | Sign-in redirect   | `http://localhost:3000`         |
| `REACT_APP_ASGARDEO_SIGN_OUT_REDIRECT_URL` | Sign-out redirect  | `http://localhost:3000`         |
| `REACT_APP_API_BASE_URL`                   | Backend API URL    | `http://localhost:9090/api`     |

## Testing

### Manual Testing

1. Start the application
2. Navigate to http://localhost:3000
3. Click "Sign In with Asgardeo"
4. Log in with your Asgardeo account
5. Test CRUD operations:
   - Create a new post
   - View all posts
   - Edit your post
   - Delete your post
6. Verify you can only edit/delete your own posts

### API Testing with curl

```bash
# Get an access token from Asgardeo first
TOKEN="your-access-token"

# Health check
curl http://localhost:9090/api/health

# Create a post
curl -X POST http://localhost:9090/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"This is a test"}'

# Get all posts
curl http://localhost:9090/api/posts \
  -H "Authorization: Bearer $TOKEN"

# Update a post
curl -X PUT http://localhost:9090/api/posts/{id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete a post
curl -X DELETE http://localhost:9090/api/posts/{id} \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string format
- Verify username/password
- Check network connectivity

### Authentication Issues

- Verify Asgardeo configuration
- Check redirect URLs match exactly
- Ensure client ID is correct
- Check browser console for errors

### CORS Issues

- Verify backend CORS configuration
- Check allowed origins
- Ensure frontend URL is whitelisted

### Build Issues

- Clear Docker build cache: `docker-compose build --no-cache`
- Remove volumes: `docker-compose down -v`
- Check environment variables are set
- Review build logs for errors

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the documentation in `DEPLOYMENT.md`
- Review troubleshooting sections
- Open an issue on GitHub
- Consult [Ballerina documentation](https://ballerina.io/learn/)
- Check [Choreo documentation](https://wso2.com/choreo/docs/)
- Review [Asgardeo documentation](https://wso2.com/asgardeo/docs/)

## Acknowledgments

- WSO2 for Ballerina, Choreo, and Asgardeo
- MongoDB for the database
- React team for the frontend framework
- The open-source community
