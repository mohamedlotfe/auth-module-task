# React Authentication Frontend

A React + TypeScript frontend application with authentication flows, built with Vite, Tailwind CSS, and modern form handling.

## Features

- 🔐 **Authentication**: Sign up, sign in, and logout with form validation
- 🛡️ **Protected Routes**: Route guards that check authentication status
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 📝 **Form Handling**: React Hook Form with Zod validation
- 🍪 **Dual Auth**: HTTP-only cookies + JWT in localStorage
- 🐳 **Docker Ready**: Multi-stage build with nginx

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router** for routing
- **React Hook Form** + **Zod** for forms and validation
- **Tailwind CSS** for styling
- **ESLint** + **Prettier** for code quality

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp env.example .env
```

3. Update `.env` with your API base URL:

```
VITE_API_BASE_URL=http://localhost:3000
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## API Integration

The frontend expects the following backend endpoints:

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/logout` - User logout
- `GET /profile` - Get user profile

### Authentication Flow

1. **Sign Up/Sign In**: Forms validate input and call auth endpoints
2. **Token Storage**: Access tokens stored in localStorage, refresh tokens in HTTP-only cookies
3. **Protected Routes**: Check `/profile` endpoint to verify authentication
4. **Logout**: Clear tokens and redirect to sign in

## Docker

### Build Docker Image

```bash
docker build -t react-auth-frontend .
```

### Run Container

```bash
docker run -p 80:80 react-auth-frontend
```

The app will be available at `http://localhost`

## Project Structure

```
src/
├── api/           # API client and endpoints
├── components/    # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
│   └── auth/      # Authentication pages
├── types/         # TypeScript type definitions
└── App.tsx        # Main app component
```

## Environment Variables

| Variable            | Description          | Default                 |
| ------------------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## Form Validation

- **Email**: Valid email format required
- **Password**: Minimum 8 characters with uppercase, lowercase, and number
- **Confirm Password**: Must match password field
- **Server Errors**: Displayed for API validation failures

## Protected Routes

Routes are protected by checking the `/profile` endpoint:

- ✅ Authenticated users can access protected routes
- ❌ Unauthenticated users are redirected to `/signin`
- 🔄 Loading states shown during authentication checks

## Production Build

The production build creates optimized static files in the `dist/` directory:

```bash
npm run build
```

Files are ready to be served by any static file server or nginx.
