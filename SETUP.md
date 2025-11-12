# Catering Service Website - Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/catering-service
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

Seed admin user (optional):
```bash
npm run seed
```
This creates an admin user:
- Email: `admin@catering.com`
- Password: `admin123`

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

## User Roles

### Client
- Register as a client
- View menu
- Create bookings
- View their bookings

### Worker
- Self-register as a worker
- View available bookings
- Accept available bookings
- View assigned bookings
- Update booking status
- Set availability status

### Admin
- Manage menu items (CRUD)
- View all bookings
- Manage users
- View statistics

## Default Admin Account

After running the seed script:
- Email: `admin@catering.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register/client` - Register as client
- `POST /api/auth/register/worker` - Register as worker
- `POST /api/auth/login` - Login

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Bookings
- `POST /api/bookings` - Create booking (client)
- `GET /api/bookings` - Get bookings
- `GET /api/bookings/available` - Get available bookings (worker)
- `GET /api/bookings/my-jobs` - Get worker's jobs (worker)
- `PUT /api/bookings/:id/accept` - Accept booking (worker)
- `PUT /api/bookings/:id/status` - Update status (worker/admin)

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user (workers can update availability)
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check the MONGODB_URI in your `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Issues
- The backend is configured to allow requests from `http://localhost:5173`
- If using a different port, update the CORS configuration in `server/server.js`

### Authentication Issues
- Make sure JWT_SECRET is set in the `.env` file
- Clear localStorage and try logging in again
- Check that the token is being sent in the Authorization header

## Production Deployment

1. Set `NODE_ENV=production` in your `.env` file
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or a secure MongoDB instance
4. Build the frontend: `cd client && npm run build`
5. Serve the built files using a web server (nginx, Apache, etc.)
6. Run the backend using a process manager (PM2, etc.)

