# UrgOO Cinema Backend API

This is the backend API server for the UrgOO Cinema application. It provides RESTful endpoints to serve movie data, branch information, seat availability, and more.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   Or start the production server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Movies
- **GET** `/api/movies` - Get all current movies
- **GET** `/api/movies/upcoming` - Get upcoming movies

### Branches
- **GET** `/api/branches` - Get all cinema branches

### Seats
- **GET** `/api/seats/availability` - Get real-time seat availability

### User
- **GET** `/api/user/info` - Get user information

### Health Check
- **GET** `/api/health` - Server health check

## 📁 Project Structure

```
backend/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── data/              # JSON data files
│   ├── ongoing/
│   │   └── movies-list.json
│   ├── branches/
│   │   └── branch-list.json
│   ├── realtime-data/
│   │   └── seat-availability.json
│   ├── upcoming/
│   │   └── upcoming.json
│   └── user/
│       └── user-info.json
└── README.md          # This file
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3001)

### CORS
The server is configured to allow cross-origin requests from your frontend.

## 🚦 Development

To run the server in development mode with auto-restart:
```bash
npm run dev
```

## 📝 Notes

- The server currently reads from static JSON files in the `data/` directory
- All data is copied from your frontend's `data/` folder
- CORS is enabled to allow requests from your frontend application
- Error handling is implemented for all endpoints

## 🔄 Next Steps

1. **Database Integration**: Replace JSON files with a proper database (MongoDB, PostgreSQL, etc.)
2. **Authentication**: Add user authentication and authorization
3. **Real-time Updates**: Implement WebSocket for real-time seat availability
4. **Data Validation**: Add request/response validation
5. **Logging**: Implement proper logging system
6. **Testing**: Add unit and integration tests
