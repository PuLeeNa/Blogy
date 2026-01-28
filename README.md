# Blogy

A modern full-stack blog platform with React, Ballerina, MongoDB, Asgardeo authentication and deployed on WSO2 Choreo.

## 🌐 Live Demo

**Try it now:** [https://blogy.choreoapps.dev](https://blogy.choreoapps.dev)

## Tech Stack

- **Frontend**: React with React Router
- **Backend**: Ballerina REST API
- **Database**: MongoDB
- **Auth**: Asgardeo (OAuth2)
- **Deploy**: Docker + WSO2 Choreo

## Features

- 🏠 Public blog viewing - no authentication required
- ✍️ Create, edit, and delete posts (authenticated users)
- 🔒 Secure OAuth2 authentication with Asgardeo
- 👤 User-based post ownership and authorization
- 🎨 Modern UI with toast notifications
- 📱 Responsive design
- 🐳 Docker containerization

## Project Structure

### Frontend

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.js      # Navigation header with auth
│   │   ├── PostCard.js    # Blog post display card
│   │   └── PostForm.js    # Create/edit post form
│   ├── pages/             # Route pages
│   │   ├── Home.js        # Blog list (public)
│   │   ├── CreatePost.js  # New post page
│   │   └── EditPost.js    # Edit post page
│   ├── App.js             # Router configuration
│   └── index.js           # Entry point
```

### Backend

```
backend/
├── service.bal            # Main API service
├── auth.bal               # JWT authentication logic
├── database.bal           # MongoDB connection
├── types.bal              # Type definitions
└── utils.bal              # Utility functions
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Ballerina 2201.9.0
- Asgardeo account ([sign up](https://console.asgardeo.io/))
- MongoDB Atlas account

### Setup

1. **Configure Asgardeo**
   - Create a Single Page Application
   - Set redirect URL: `http://localhost:3000`
   - Note your Client ID and Organization

2. **Configure Environment**

   Create `frontend/.env`:

   ```env
   REACT_APP_ASGARDEO_CLIENT_ID=your_client_id
   REACT_APP_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/your_org
   REACT_APP_API_BASE_URL=http://localhost:9090/api
   ```

   Create `backend/Config.toml`:

   ```toml
   MONGODB_URI = "mongodb+srv://username:password@cluster.mongodb.net/"
   MONGODB_DATABASE = "blog_db"
   ASGARDEO_ISSUER = "https://api.asgardeo.io/t/your_org/oauth2/token"
   ASGARDEO_AUDIENCE = "your_client_id"
   ASGARDEO_JWKS_URL = "https://api.asgardeo.io/t/your_org/oauth2/jwks"
   PORT = "9090"
   ```

3. **Install Dependencies & Run**

   **Backend:**

   ```bash
   cd backend
   bal run
   ```

   **Frontend:**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access Application**
   - **Blog Home**: http://localhost:3000 (public - view all posts)
   - **Backend API**: http://localhost:9090/api
   - Click "Sign In" to authenticate and create posts

## How It Works

### Public Viewing

- Navigate to `http://localhost:3000` to see all blog posts
- No authentication required to browse blogs
- Clean, responsive interface

### Creating Posts

1. Click "Sign In" in header
2. Authenticate with Asgardeo
3. Click "New Post" button (now visible)
4. Fill in title and content
5. Submit to create post

### Managing Posts

- **Edit**: Only visible to post authors - click Edit, modify, save
- **Delete**: Only visible to post authors - click Delete, confirm
- Posts show author email and creation date

### Authentication Flow

- **Not Signed In**: Header shows "Sign In" button
- **Signed In**: Header shows "New Post" and "Sign Out" buttons
- Protected routes redirect to sign-in if needed
- Toast notifications guide user actions

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
