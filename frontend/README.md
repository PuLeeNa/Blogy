# Blog Frontend - React

A simple React frontend for the blog application with Asgardeo authentication.

## Features

- Asgardeo OAuth2/OIDC authentication
- Create, read, update, and delete blog posts
- User-based post ownership
- Responsive design
- Simple and clean UI

## Prerequisites

- Node.js 16+ and npm
- Asgardeo application configured

## Environment Variables

Create a `.env` file in the frontend directory:

```bash
REACT_APP_ASGARDEO_CLIENT_ID=your_client_id
REACT_APP_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/{org_name}
REACT_APP_ASGARDEO_SIGN_IN_REDIRECT_URL=http://localhost:3000
REACT_APP_ASGARDEO_SIGN_OUT_REDIRECT_URL=http://localhost:3000
REACT_APP_API_BASE_URL=http://localhost:9090/api
```

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at http://localhost:3000

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Running with Docker

```bash
# Build Docker image
docker build -t blog-frontend .

# Run container
docker run -p 80:80 blog-frontend
```

## Deploying to Choreo

1. Push code to a GitHub repository
2. Create a new Web Application component in Choreo
3. Connect your GitHub repository
4. Configure environment variables in Choreo
5. Deploy the application

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## Asgardeo Configuration

In your Asgardeo application settings:

1. Add `http://localhost:3000` to Authorized Redirect URLs (for local development)
2. Add your Choreo frontend URL to Authorized Redirect URLs (for production)
3. Enable the required scopes: `openid`, `profile`, `email`
4. Note your Client ID for the environment variables
