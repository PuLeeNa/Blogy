# Blog Application

A full-stack blog platform with React, Ballerina, MongoDB, and Asgardeo authentication.

## Tech Stack

- **Backend**: Ballerina REST API
- **Frontend**: React
- **Database**: MongoDB
- **Auth**: Asgardeo (OAuth2/OIDC)
- **Deploy**: Docker + WSO2 Choreo

## Features

- Create, read, update, and delete blog posts
- Secure OAuth2 authentication
- User-based post ownership
- Docker containerization

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Asgardeo account ([sign up](https://console.asgardeo.io/))
- MongoDB (local or Atlas)

### Setup

1. **Configure Asgardeo**
   - Create a Single Page Application
   - Set redirect URL: `http://localhost:3000`
   - Note your Client ID and Organization

2. **Configure Environment**

   ```bash
   # Edit .env with your Asgardeo credentials
   ```

3. **Run Application**

   ```bash
   docker-compose up -d
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:9090/api

## Environment Variables

**Required in `.env`:**

```env
# Asgardeo
ASGARDEO_ISSUER=https://api.asgardeo.io/t/YOUR_ORG/oauth2/token
ASGARDEO_AUDIENCE=YOUR_CLIENT_ID
ASGARDEO_JWKS_URL=https://api.asgardeo.io/t/YOUR_ORG/oauth2/jwks

# Frontend
REACT_APP_ASGARDEO_CLIENT_ID=YOUR_CLIENT_ID
REACT_APP_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/YOUR_ORG
REACT_APP_API_BASE_URL=http://localhost:9090/api

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=blog_db
```

## API Endpoints

| Method | Endpoint          | Description  | Auth Required |
| ------ | ----------------- | ------------ | ------------- |
| GET    | `/api/health`     | Health check | No            |
| POST   | `/api/posts`      | Create post  | Yes           |
| GET    | `/api/posts`      | List posts   | Yes           |
| GET    | `/api/posts/{id}` | Get post     | Yes           |
| PUT    | `/api/posts/{id}` | Update post  | Yes (owner)   |
| DELETE | `/api/posts/{id}` | Delete post  | Yes (owner)   |

## Development

**Run Backend:**

```bash
cd backend
bal run
```

**Run Frontend:**

```bash
cd frontend
npm install
npm start
```

## Deployment to Choreo

1. Push code to GitHub
2. Create Service component (backend) in Choreo
3. Create Web Application component (frontend) in Choreo
4. Configure environment variables
5. Update Asgardeo redirect URLs with Choreo URLs
6. Deploy

