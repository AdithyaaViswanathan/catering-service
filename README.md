# Catering Service Website

A full-stack catering service website with role-based access control for clients, workers, and admins.

## Features

- **Client Role**: View menu, book catering services, view bookings
- **Worker Role**: Self-register, view available bookings, accept bookings, manage assigned jobs
- **Admin Role**: Manage menu items, view all bookings, manage users, view statistics

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Validation**: Express Validator

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory (you can copy from `.env.example`):
```env
MONGODB_URI=mongodb://localhost:27017/catering-service
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

> Environment files:
> - `.env.example` is included with sensible defaults for local development.
> - If you don’t have MongoDB running, you can leave `MONGODB_URI` empty. The dev server will still start, but database-dependent endpoints will return errors until a DB is configured.

4. Seed admin user (optional):
```bash
npm run seed
```
This will create an admin user with:
- Email: `admin@catering.com`
- Password: `admin123`

5. Start the server:
```bash
npm run dev
```
Or for production:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Authentication
- `POST /api/auth/register/client` - Register as client
- `POST /api/auth/register/worker` - Register as worker
- `POST /api/auth/register/admin` - Register as admin (admin only)
- `POST /api/auth/login` - Login

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

### Bookings
- `POST /api/bookings` - Create booking (client only)
- `GET /api/bookings` - Get bookings (client: own, admin: all, worker: assigned)
- `GET /api/bookings/available` - Get available bookings (worker only)
- `GET /api/bookings/my-jobs` - Get worker's assigned bookings (worker only)
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/accept` - Accept booking (worker only)
- `PUT /api/bookings/:id/status` - Update booking status (worker/admin)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## User Roles

### Client
- Register and login
- View menu
- Create bookings
- View their own bookings

### Worker
- Self-register and login
- View available bookings
- Accept available bookings
- View assigned bookings
- Update booking status
- Set availability status

### Admin
- Register (via seed script or existing admin)
- Manage menu items (CRUD)
- View all bookings
- Manage users (view, update, delete)
- View statistics

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variables for sensitive data

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Seed scripts
│   └── server.js          # Entry point
└── README.md
```

## License

ISC

